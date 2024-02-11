const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controlleurs/user');

router.get('/users', auth, userCtrl.getAllUsers);
router.post('/createUser', auth, userCtrl.createUser);
router.post('/login', userCtrl.login);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', auth, userCtrl.deleteUser);

module.exports = router;