const express = require('express')
const multer = require('multer')
const { validationResult } = require('express-validator')

const { checkTitle, checkPrice } = require('./validators')
const productsRepo = require('../../repositories/products')
const productNewTemplate = require('../../views/admin/products/new')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage()
})

router.get('/admin/products', (req, res) => {

})

router.get('/admin/product/new', (req, res) => {
  res.send(productNewTemplate({}))
})

router.post('/admin/product/new', [checkTitle, checkPrice], upload.single('image'), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.send(productNewTemplate({ errors }))
  } else {
    // base64 is safest way to convert file buffer to String
    const image = req.file.buffer.toString('base64')
    const { title, price } = req.body

    const product = await productsRepo.create({
      title,
      price,
      image
    })
    res.send('product created')
  }
})

module.exports = router
