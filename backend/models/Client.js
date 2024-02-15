const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const clientSchema = new mongoose.Schema(
    {
        client: {type: String, required: true},
        category: {type: String, required: true},
        city: {type: String, required: true},
        type: String,
        catalogue:[{
            name: String,
            sentDate: Date,
            sentBy: String
        }],
        contact:{
            name: String,
            fixe: String,
            whatsapp: String,
            address: String,
            role: String
        },
        comment: String
    }
);

clientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Client', clientSchema);