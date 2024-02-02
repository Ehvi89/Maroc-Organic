const mongoose = require("mongoose")
const mongoosePagination = require('mongoose-paginate-v2');

const reportSchema = new mongoose.Schema(
    {
        author: String,
        client: String,
        type: String,
        date: Date,
        hour: String,
        duration: Number,
        person: String,
        competingBrands: [String],
        contact:{
            nom: String,
            whatsapp:String
        },
        contactMOGiven: Boolean,
        clientFollow: Boolean
    }
);

reportSchema.plugin(mongoosePagination);

module.exports = mongoose.model('Report', reportSchema);