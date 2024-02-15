const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controlleurs/user');

router.get('/users', auth, userCtrl.getAllUsers);
router.post('/createUser', auth, userCtrl.createUser);
router.post('/login', userCtrl.login);
router.post('/resetPassword', userCtrl.sendResetEmail);
router.put('/user', userCtrl.updateUser);
router.delete('/user/:id', auth, userCtrl.deleteUser);

module.exports = router;