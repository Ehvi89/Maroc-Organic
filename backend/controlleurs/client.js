const Client = require('../models/Client');
const User = require('../models/User');
const exceljs = require("exceljs");
const Order = require("../models/Order");

exports.getClients = async (req, res, next) => {
    const {page, limit} = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { createdAt: 1 },
    };

    try {
        const result = await Client.paginate({}, options);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

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

// Fonction pour ajouter un client
exports.addClient = async (req, res, next) => {
    try {
        const client = new Client(req.body);
        const savedClient = await client.save();

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userId, `Ajout du client ${savedClient.client}`);

        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Fonction pour mettre à jour un client
exports.updateClient = async (req, res) => {
    try {
        const id = req.params.id; // Récupère l'ID depuis les paramètres de route
        const update = req.body; // Les mises à jour à appliquer
        const options = { new: true }; // Retourne le document mis à jour

        // Utilise findByIdAndUpdate avec l'ID et les mises à jour
        const updatedDoc = await Client.findByIdAndUpdate(id, update, options);

        if (!updatedDoc) {
            return res.status(404).send({ message: 'Client not found' });
        }

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userId, `Mise à jour du client ${updatedDoc.client}`);

        res.send(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
};

// Fonction pour supprimer un client
exports.deleteClient = async (req, res) => {
    try {
        if (!req.params.id){
            return res.status(400).send({ message: 'Client ID is required.' });
        }

        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).send({ message: 'Client not found.' });
        }
        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userId, `Suppression du client ${client.client}`);

        await Client.deleteOne({ _id: req.params.id });


        res.status(200).json({ message: 'Client deleted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.export2excel = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Client");

    const clients = await Client.find();

    worksheet.columns = [
        {header: 'NOM', key: 'client', width:  15},
        {header: 'CATEGORIES', key: 'category', width:  20},
        {header: 'VILLE', key: 'city', width:  15},
        {header: 'TYPE', key: 'type', width:  20},
        {header: `CATALOGUE SENT: ${clients[0].catalogue[0].name}`, key: 'catalogue[0].sentBy', width:  25},
        {header: 'DATE SENT', key: 'catalogue[0].sentDate', width:  25},
        {header: `CATALOGUE SENT: ${clients[0].catalogue[1].name}`, key: 'catalogue[1].sentBy', width:  25},
        {header: 'DATE SENT', key: 'catalogue[1].sentDate', width:  25},
        {header: 'TELEPHONE FIXE', key: 'contact.fixe', width:  25},
        {header: 'TELEPHONE WHATSAPP', key: 'contact.whatsapp', width:  25},
        {header: 'NOM DU CONTACT', key: 'contact.name', width:  25},
        {header: 'FONCTION', key: 'contact.role', width:  20},
        {header: 'ADDRESS', key: 'contact.address', width:  25},
        {header: 'COMMENTAIRE', key: 'comment', width:  100},
    ];

    // Obtenez la première ligne (ligne d'en-tête)
    const headerRow = worksheet.getRow(1);

    // Ajoutez des styles aux titres de colonnes
    worksheet.columns.forEach(column => {
        const headerCell = headerRow.getCell(column.key);
        headerCell.font = { bold: true };
        headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
        headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '8FB750' }
        };
        headerCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    clients.forEach((client, index) => {
        const rowData = {
            client: client.client,
            category: client.category,
            city: client.city,
            type: client.type,
            'catalogue[0].sentBy': client.catalogue[0]?.sentBy,
            'catalogue[0].sentDate': client.catalogue[0]?.sentDate,
            'catalogue[1].sentBy': client.catalogue[1]?.sentBy,
            'catalogue[1].sentDate': client.catalogue[1]?.sentDate,
            'contact.fixe': client.contact?.fixe,
            'contact.whatsapp': client.contact?.whatsapp,
            'contact.name': client.contact?.name,
            'contact.role': client.contact?.role,
            'contact.address': client.contact?.address,
            comment: client.comment,
        };

        const row = worksheet.addRow(rowData);

        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            // Alterner les couleurs de fond des lignes
            if (index %   2 ===   0) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // Blanc
                };
            } else {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F5F4F4' } // Gris clair
                };
            }
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + encodeURIComponent("ClientsMarocOrganic.xlsx")
    );

    await workbook.xlsx.write(res);
    res.end();
};
