const Order = require('../models/Order');
const User = require("../models/User");
const exceljs = require("exceljs");
const Report = require("../models/Report");

exports.getOrders = async (req, res, next) => {
    const {page, limit} = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { createdAt: 1 },
    };

    try {
        const result = await Order.paginate({}, options);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

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

// Fonction pour ajouter une commande
exports.addOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body);
        const savedOrder = await order.save();

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Ajout de la commande ${savedOrder.trackingNumber}`);

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Fonction pour mettre à jour une commande
exports.updateOrder = async (req, res) => {
    try {
        const query = { _id: req.params.id };
        const options = { new: true }; // Retourne le document mis à jour
        const updatedDoc = await Order.findByIdAndUpdate(query, req.body, options);

        if (!updatedDoc) {
            return res.status(404).send({ message: 'Order not found' });
        }

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Mise à jour de la commande ${updatedDoc.trackingNumber}`);

        res.send(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
};

// Fonction pour supprimer une commande
exports.deleteOrder = async (req, res) => {
    try {
        if (!req.params.id){
            return res.status(400).send({ message: 'Order ID is required.' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found.' });
        }

        await Order.deleteOne({ _id: req.params.id });

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Suppression de la commande ${order.trackingNumber}`);

        res.status(200).json({ message: 'Order deleted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.export2excel = async (req, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Order");

    worksheet.columns = [
        { header: "DATE", key: "date", width:   15 },
        { header: "CLIENT", key: "name", width:   25 },
        { header: "VILLE", key: "city", width:   25 },
        { header: "MONTANT", key: "amount", width:   10 },
        { header: "MODE DE PAIEMENT", key: "paymentMethod", width:   15 },
        { header: "N° DU CHEQUE", key: "chequeNumber", width:   20 },
        { header: "DATE DE RECEPTION CHEQUE/VIREMENT", key: "DateChequeReceived", width:   15 },
        { header: "DATE D'ÉCHÉANCE DU CHEQUE", key: "chequeDueDate", width:   15 },
        { header: "DATE DU DEPÔT DU CHEQUE A LA BANQUE", key: "DateChequeDepositedAtBank", width:   15 },
        { header: "PAIEMENT", key: "paymentConfirmation", width:   10 },
        { header: "N° DE SUIVI", key: "trackingNumber", width:   20 }, // Corrected typo here
        { header: "FACTURE", key: "billNumber", width:   20 },
        { header: "RECEPTION DE LA COMMANDE", key: "receptionConfirmation", width:   10 },
        { header: "TERMES DE PAIEMENT", key: "paymentTerms", width:  75 },
        { header: "# DE COLIS LOGIPHARS + PRESENTOIRS DANS LA COMMANDE", key: "numberPackagesAndDisplays", width:   20 },
        { header: "PAIEMENT LOGIPHAR", key: "logipharPayment", width:   10 },
        { header: "COMMENTAIRE", key: "comment", width: 150 },
    ];

    try {
        let orders = await Order.find(); // Await the Promise returned by Order.find()

        // Convert boolean values to "Yes" or "No" for paymentConfirmation
        orders = orders.map(order => {
            return {
                ...order._doc, // Spread the rest of the order object
                paymentConfirmation: order.paymentConfirmation ? 'Oui' : 'Non',
                receptionConfirmation: order.receptionConfirmation ? 'Oui' : 'Non'
            };
        });

        orders.forEach((order) => {
            worksheet.addRow(order);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Orders.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: error.message });
    }
};