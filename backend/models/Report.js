const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        author: {
            name: {type: String, require: true},
            email: { type: String, require: true }
        },
        client: { type: String, require: true },
        city: String,
        type: { type: String, require: true },
        date: { type: Date, require: true },
        hour: { type: String, require: true },
        duration: Number,
        person: String,
        competingBrands: [{
            name: String
        }],
        contact:{
            name: String,
            whatsapp:String
        },
        alreadyClient:{ type: Boolean, require: true },
        contactMOGiven: { type: Boolean, require: true },
        clientFollow: { type: Boolean, require: true },
        comment: String
    }
);

module.exports = mongoose.model('Report', reportSchema);