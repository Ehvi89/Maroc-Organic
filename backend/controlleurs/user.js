const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Utilisation d'une variable d'environnement pour le secret JWT
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVGRlaG9oZmFhaGMgdWhhZXV1aWdyaWdhZXlmZ3llamZhYmtqZmlhdmhlY3Zhamh2amRndnhhdmtqaHZmZXlmdmFqa2FlY3ZldXZja3FoY2IgcWdmdXFlZnZhaHZicWhwYXY4NDY1NDY1NGU2ZjQ2cTRlZjZmZWdxNno2Z3pyaDZxaHF6NjQ2cTU0djMifQ.eyJzdWIiOiIxMjM0NTg3Njg0ODE0ODA4MDg3ZW1kKsO5bcO5c2x4a2xqZmthbGtuZmplYiBjbmVoa2FrYmZhamdoYWplbWp2YjY3ODkwIiwibmFtZSI6IkVob2x5IEFiYmxpIE1pZXNzYW4gU2FtdWVsIFZpYW5ubmV5IC0gTWFyb2MgT3JnYW5pYyIsImlhdCI6MS41MTYyMzkwMjIwMTUxODQ2ZSszM30.jzqCqaO9UHoAlUMG_uLA93DoYzr1mOPlIg1nb8fOQfM';

// Fonction d'aide pour mettre à jour le champ lastAction d'User
const updateUserLastAction = async (userEmail, actionDescription) => {
    const updateFields = {
        $set: {
            lastAction: actionDescription
        }
    };
    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ email: userEmail });
    if (user) {
        // Mettre à jour le champ lastAction d'User trouvé
        await User.findByIdAndUpdate(user._id, updateFields);
    } else {
        console.log('User not found');
    }
};


// Fonction pour créer un nouvel utilisateur
exports.createUser = async (req, res, next) => {
    try {
        // Création d'un hachage pour le mot de passe
        const hash = await bcrypt.hash(req.body.password,  10);
        // Création d'un nouvel utilisateur avec les données fournies
        const user = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            role: req.body.role
        });
        // Sauvegarde de l'utilisateur dans la base de données
        await user.save();
        await updateUserLastAction(req.body.userEmail, `Création de l'utilisateur ${user.name}`);
        // Réponse indiquant la création réussie de l'utilisateur
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        // Gestion des erreurs lors de la création de l'utilisateur
        res.status(500).json({ error: error.message });
    }
};


// Fonction pour authentifier un utilisateur
exports.login = async (req, res, next) => {
    try {
        // Recherche de l'utilisateur par e-mail
        const user = await User.findOne({ email: req.body.email });
        // Si l'utilisateur n'est pas trouvé, renvoie une erreur
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison du mot de passe fourni avec le mot de passe stocké
        const valid = await bcrypt.compare(req.body.password, user.password);
        // Si le mot de passe est incorrect, renvoie une erreur
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        // Mise à jour du champ lastLogin avec la date et l'heure actuelles
        user.lastLogin = new Date();
        await user.save();

        // Génération d'un token JWT si le mot de passe est correct
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        // Réponse contenant l'ID de l'utilisateur et le token JWT
        res.status(200).json({ user: user, token });
    } catch (error) {
        // Gestion des erreurs lors de l'authentification
        res.status(500).json({ error: error.message });
    }
};


// Fonction pour mettre à jour les informations d'un utilisateur
exports.updateUser = async (req, res) => {

    console.log(req.body)
    try {
        // Validation des entrées
        if (!req.body.email || typeof req.body.email !== 'string') {
            return res.status(400).json({ error: 'Email invalide.' });
        }
        if (req.body.name && typeof req.body.name !== 'string') {
            return res.status(400).json({ error: 'Nom invalide.' });
        }
        if (req.body.newPassword && typeof req.body.newPassword !== 'string') {
            if(req.body.confirmPassword && typeof req.body.newPassword !== 'string'){
                return res.status(400).json({ error: 'Nouveau mot de passe invalide.' });
            }

            if (req.body.confirmPassword !== req.body.newPassword){
                return res.status(400).json({ error: 'Les mot de passe ne sont pas identique'})
            }
        }

        console.log(1)
        // Supposons que `user` est un objet qui représente l'utilisateur dans votre base de données
        // et que `bcrypt` est importé pour hasher le mot de passe.

        if (req.body.token) {
            // Vérifiez si le token existe dans la base de données pour l'utilisateur
            const user = await User.findOne({ resetPasswordToken: req.body.token });
            console.log('1-1')
            if (!user) {
                return res.status(400).json({
                    error: 'Le token n\'est pas valide ou a expiré'
                });
            }
            console.log('1-2')

            // Vérifiez si le token n'a pas expiré
            const currentTime = Date.now();
            if (currentTime > user.resetPasswordExpires) {
                return res.status(400).json({
                    error: 'Le token n\'est plus valide'
                });
            }

            console.log('1-3')


            // Création d'un hachage pour le nouveau mot de passe
            user.password = await bcrypt.hash(req.body.newPassword,  10);
            console.log('1-4')

            // Supprimez le token de réinitialisation du mot de passe et mettez à jour la date de modification
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenCreatedAt = undefined;
            console.log('1-5')

            // Enregistrez les modifications dans la base de données
            await user.save();

            return res.status(200).json({
                message: 'Le mot de passe a été réinitialisé avec succès'
            });
        }

        const user = await User.findOne({email: req.body.email});

        console.log(2)

        // Si l'utilisateur n'est pas trouvé, renvoie une erreur
        if (!user) {
            //user.email = req.body.email
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }

        // Mise à jour du nom si fourni
        if (req.body.name) {
            user.name = req.body.name;
        }

        // Mise à jour du mot de passe si fourni
        if (req.body.newPassword) {
            // Création d'un hachage pour le nouveau mot de passe
            user.password = await bcrypt.hash(req.body.newPassword,  10);
        }

        // Sauvegarde de l'utilisateur mis à jour dans la base de données
        await user.save();

        await updateUserLastAction(req.body.email, `Mise à jour du mot de passe`);
        // Réponse indiquant la mise à jour réussie de l'utilisateur
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès !' });
    } catch (error) {
        // Gestion des erreurs lors de la mise à jour de l'utilisateur
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.' });
    }
};



exports.getAllUsers = (req, res) => {
    User.find()
        .then((users) => {
            // Vérifiez si la liste des utilisateurs est vide
            if (!users || users.length ===  0) {
                return res.status(404).json({ message: 'No users found.' });
            }
            // Réponse avec succès
            return res.status(200).json(users);
        })
        .catch((error) => {
            // Log de l'erreur pour le débogage
            console.error('Error retrieving users:', error);
            // Réponse avec un statut d'erreur et un message
            return res.status(500).json({ message: 'An error occurred while retrieving users.', error: error.message });
        });
};


exports.deleteUser = (req, res) => {

    // Trouvez l'utilisateur par son ID
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Supprimez l'utilisateur de la base de données
            User.deleteOne({ _id: req.params.id })
                .then(async () => {
                    await updateUserLastAction(req.body.userEmail, `Suppression de l'utilisateur ${user.name}`);
                    res.status(200).json({message: 'User deleted successfully!'});
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};


function generateResetToken() {
    // Génère un token aléatoire de 20 caractères
    return crypto.randomBytes(20).toString('hex');
}

async function sendResetPasswordEmail(email, token) {
    // Configurez votre transport d'e-mail avec nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail', // ou un autre service d'e-mail
        auth: {
            user: 'eholysamuel89@gmail.com', // Utilisez des variables d'environnement pour les informations sensibles
            pass: 'jwzb lxov viky qpqx',
        },
    });

    // Créez le contenu de l'e-mail
    let mailOptions = {
        from: '"no-reply" <no-reply@gmail.com>',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :<a href="http://localhost:3000/resetPasswordRequest?token=${token}&email=${email}">Réinitialiser le mot de passe</a><br/>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.`
    };

    // Envoyez l'e-mail
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.sendResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Vérifiez si l'adresse e-mail existe
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({ message: 'Adresse e-mail non trouvée.' });
        }

        // Générez un token pour la réinitialisation du mot de passe
        const token = generateResetToken();

        // Mettez à jour le token de l'utilisateur dans la base de données
        user.resetPasswordToken = token; // Assurez-vous que le champ est correctement nommé
        user.resetPasswordExpires = Date.now() +  3600000; // Définissez une date d'expiration pour le token

        // Envoyez l'e-mail avec le token
        await sendResetPasswordEmail(email, token);
        await user.save(); // Sauvegardez les modifications de l'utilisateur

        res.status(200).json({ message: `Un e-mail de réinitialisation a été envoyé à l'adresse ${email}.` });
    } catch (error) {
        console.error('Error processing reset password request:', error);
        res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation du mot de passe.' });
    }
};
