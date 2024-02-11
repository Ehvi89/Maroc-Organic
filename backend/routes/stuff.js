const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Routes for Client
const clientController = require('../controlleurs/client');

router.post('/client/export2excel', auth, clientController.export2excel);
router.get('/client', auth, clientController.getClients);
router.post('/client', auth, clientController.addClient);
router.put('/client/:id', auth, clientController.updateClient);
router.delete('/client/:id', auth, clientController.deleteClient);

// Routes for Order
const orderController = require('../controlleurs/orderPayment');

router.post('/order/export2excel', auth, orderController.export2excel);
router.get('/order', auth, orderController.getOrders);
router.post('/order', auth, orderController.addOrder);
router.put('/order/:id', auth, orderController.updateOrder);
router.delete('/order/:id', auth, orderController.deleteOrder);

// Routes for Visits
const visitController =require('../controlleurs/report')

router.post('/report/export2excel', auth, visitController.export2excel);
router.get('/report/weeks', auth, visitController.getWeeksList);
router.get('/report', auth, visitController.getReports);
router.post('/report', auth, visitController.addReport);
router.put('/report/:id', auth, visitController.updateReport);
router.delete('/report/:id', auth, visitController.deleteReport);

module.exports = router;