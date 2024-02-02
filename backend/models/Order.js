const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const orderschema = new mongoose.Schema(
    {
        client: String,
        city: String,
        amount: Number,
        paymentConfirmation: Boolean,
        paymentMethod: String,
        chequeNumber: String,
        DateChequeReceived: Date,
        chequeDueDate: Date,
        DateChequeDepositedAtBank: Date,
        trackingNumber: Number,
        billNumber: String,
        paymentTerms: String,
        numberPackagesAndDisplays: String,
        logipharPayment: String,
        comment: String
    }
);

orderschema.plugin(mongoosePagination);

module.exports = mongoose.model('Order', orderschema);