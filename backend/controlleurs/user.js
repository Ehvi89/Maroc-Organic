const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utilisation d'une variable d'environnement pour le secret JWT
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Fonction d'aide pour mettre à jour le champ lastAction du User
const updateUserLastAction = async (userEmail, actionDescription) => {
    const updateFields = {
        $set: {
            lastAction: actionDescription
        }
    };
    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ email: userEmail });
    if (user) {
        // Mettre à jour le champ lastAction du User trouvé
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
            return res.status(400).json({ error: 'Nouveau mot de passe invalide.' });
        }

        // Recherche de l'utilisateur par e-mail
        const user = await User.findById(req.params.id);
        // Si l'utilisateur n'est pas trouvé, renvoie une erreur
        if (!user) {
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