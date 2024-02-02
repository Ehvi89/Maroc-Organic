const Client = require('../models/Client');

exports.getClients = async (req, res, next) => {
    const {page, limit} = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
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

exports.addClient = (req, res, next) => {
    const client = new Client(req.body);

    client.save()
        .then((client) => {
            res.status(201).json(client);
        })
        .catch((error) =>{
            res.status(400).json({
                error: error
            });
        });
}