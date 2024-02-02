const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
    const {page, limit} = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
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

exports.addOrder = (req, res, next) => {
    const order = new Order(req.body);

    order.save()
        .then((order) => {
            res.status(201).json(order);
        })
        .catch((error) =>{
            res.status(400).json({
                error: error
            });
        });
}