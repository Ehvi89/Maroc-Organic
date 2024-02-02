const express = require('express');
const router = express.Router();

// Routes for Client
const clientController = require('../controlleurs/client');

router.get('/client', clientController.getClients);
router.post('/client', clientController.addClient);

// Routes for Order
const orderController = require('../controlleurs/orderPayment');

router.get('/order', orderController.getOrders);
router.post('/order', orderController.addOrder);

// Routes for Visits
const visitController =require('../controlleurs/report')

module.exports = router;