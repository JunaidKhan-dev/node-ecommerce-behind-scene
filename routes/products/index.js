const express = require('express')
const router = express.Router()

const productsIndexTemplate = require('../../views/products')
const productRepo = require('../../repositories/products')
router.get('/', async (req, res) => {
  console.log('i run')

  const products = await productRepo.getAll()
  console.log(products)
  res.send(productsIndexTemplate({ products }))
})
module.exports = router
