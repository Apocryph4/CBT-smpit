const express = require('express');
const route = express()

const userController = require('../controllers/user_controller')

route.get('/', userController.get);
route.get('/:user_id', userController.getById)

module.exports = route  