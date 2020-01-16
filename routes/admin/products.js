const express = require('express')
const multer = require('multer')
const { validationResult } = require('express-validator')

const { checkTitle, checkPrice } = require('./validators')
const productsRepo = require('../../repositories/products')
const productNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products')
const productEditTemplate = require('../../views/admin/products/edit')
const { requireAuth } = require('./middlewares')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage()
})

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsIndexTemplate({ products }))
})

router.get('/admin/product/new', requireAuth, (req, res) => {
  res.send(productNewTemplate({}))
})

// here the validator comes later as multer is parsing all data not urlEncoder, so we need to first use upload so multer activate and upload file and checl the other fields as well, otherwise we will not able to validate these fields!!!
router.post('/admin/product/new', requireAuth, upload.single('image'), [checkTitle, checkPrice], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.send(productNewTemplate({ errors }))
  } else {
    // base64 is safest way to convert file buffer to String
    const image = req.file.buffer.toString('base64')
    const { title, price } = req.body

    await productsRepo.create({
      title,
      price,
      image
    })
    res.redirect('/admin/products')
  }
})

router.get('/admin/products/:slug/edit', requireAuth, async (req, res) => {
  const productIdInit = req.params.slug.split('-')
  const productId = productIdInit[productIdInit.length - 1]
  const product = await productsRepo.getOne(productId)
  if (!product) return res.send('Product Not Found')

  res.send(productEditTemplate({ product }))
})

router.post('/admin/products/:slug/edit',
  requireAuth,
  upload.single('image'),
  [checkTitle, checkPrice],
  async (req, res) => {
    const errors = validationResult(req)
    const productIdInit = req.params.slug.split('-')
    const productId = productIdInit[productIdInit.length - 1]
    const product = await productsRepo.getOne(productId)
    if (!product) return res.send('product not found')

    if (!errors.isEmpty()) {
      console.log(errors)
      return res.send(productEditTemplate({ product, errors }))
    } else {
      const changes = req.body
      if (req.file) {
        changes.image = req.file.buffer.toString('base64')
      }
      try {
        await productsRepo.update(productId, changes)
      } catch (error) {
        return res.send('Product not found')
      }

      res.redirect('/admin/products')
    }
  })

router.post('/admin/products/:slug/delete', requireAuth, async (req, res) => {
  const productIdInit = req.params.slug.split('-')
  const productId = productIdInit[productIdInit.length - 1]
  await productsRepo.delete(productId)
  res.redirect('/admin/products')
})

module.exports = router
