const express = require('express')
const router = express.Router()

const productsIndexTemplate = require('../products')
const productRepo = require('../../repositories/products')
router.get('/', async (req, res) => {
  try {
    const products = await productRepo.getAll()
    console.log(products)
    res.send(productsIndexTemplate({ products }))
  } catch (error) {
    res.send(error)
  }
})
module.exports = router
