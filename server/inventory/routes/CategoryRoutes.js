const { createCategory, getCategoryById, getCategory, updateCategory, deleteCategoryById, createMultipleCategory } = require('../controller/category')

const Router = require('express').Router()

Router.route('/category').post(createCategory)
Router.route('/Category/Multiple').post(createMultipleCategory)
Router.route('/category/:id').get(getCategoryById)
Router.route('/category').get(getCategory)
Router.route('/category/:id').put(updateCategory)
Router.route('/category/:id').delete(deleteCategoryById)

module.exports = Router