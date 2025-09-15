const { createProducts, getProductById, getProducts, updateProduct } = require('../controller/product')

const Router = require('express').Router()

Router.route('/product').post(createProducts)
Router.route('/product').get(getProducts)
Router.route('/product/:id').get(getProductById)
Router.route('/product/:id').put(updateProduct)

module.exports = Router