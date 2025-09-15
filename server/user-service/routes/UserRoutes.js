const { signup, login, isAuth } = require('../controller/userController');

const Router = require('express').Router();

Router.route('/user/signup').post(signup)
Router.route('/user/login').post(login)
Router.route('/isAuth').get(isAuth)
module.exports =  Router;