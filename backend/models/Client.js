const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const clientSchema = new mongoose.Schema(
    {
        client: String,
        category: String,
        city: String,
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
            email: String
        },
        comment: String
    }
);

clientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Client', clientSchema);