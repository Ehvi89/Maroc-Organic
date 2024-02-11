const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const orderschema = new mongoose.Schema(
    {
        date: {type: Date, required: true},
        client: {type: String, required: true},
        city: String,
        amount: Number,
        paymentConfirmation: {type: Boolean, required: true},
        paymentMethod: {type: String, required: true},
        chequeNumber: String,
        DateChequeReceived: Date,
        chequeDueDate: Date,
        DateChequeDepositedAtBank: Date,
        trackingNumber: {type: String, required: true, unique: true},
        billNumber: {type: String, required: true, unique: true},
        paymentTerms: String,
        receptionConfirmation: Boolean,
        numberPackagesAndDisplays: String,
        logipharPayment: String,
        comment: String
    }
);

orderschema.plugin(mongoosePagination);

module.exports = mongoose.model('Order', orderschema);