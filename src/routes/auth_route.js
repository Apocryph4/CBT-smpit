const express = require('express')
const route = express()
const authController = require('../controllers/auth_controller')

route.post('/login', authController.login)
route.post('/register', authController.register)

module.exports = route