const { signup, login } = require('../controller/seller')

const Router = require('express').Router()

Router.route('/seller/signup').post(signup)
Router.route('/seller/login').post(login)

module.exports = Router