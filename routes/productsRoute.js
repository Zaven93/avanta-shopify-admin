const router = require('express').Router()
const productsController = require('../controllers/productsController')

router.get('/', productsController.getProducts)

router.post('/next', productsController.productsNext)

router.post('/previous', productsController.productsPrevious)

module.exports = router
