const express = require('express');
const router = express.Router();
const { userRegistercontroller, userLogincontroller } = require('../controllers/auth.controller');

router.post('/register', userRegistercontroller);

router.post('/login', userLogincontroller);

module.exports = router;


