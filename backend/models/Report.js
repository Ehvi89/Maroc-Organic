const mongoose = require("mongoose")
const reportSchema = new mongoose.Schema(
    {
        author: {
            name: String,
            email: String
        },
        client: String,
        city: String,
        type: String,
        date: Date,
        hour: String,
        duration: Number,
        person: String,
        competingBrands: [{
            name: String
        }],
        contact:{
            name: String,
            whatsapp:String
        },
        alreadyClient: Boolean,
        contactMOGiven: Boolean,
        clientFollow: Boolean,
        comment: String
    }
);

module.exports = mongoose.model('Report', reportSchema);