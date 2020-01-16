const express = require('express')
const router = express.Router()

const productsIndexTemplate = require('../../views/products')
const productRepo = require('../../repositories/products')
router.get('/', async (req, res) => {
  const products = await productRepo.getAll()
  res.send(productsIndexTemplate({ products }))
})
module.exports = router
