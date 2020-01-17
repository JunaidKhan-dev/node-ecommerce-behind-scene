const express = require('express')
const router = express.Router()

const cartShowTemplate = require('../../views/carts/show')
const cartRepo = require('../../repositories/carts')
const productRepo = require('../../repositories/products')

// recive a POST req to add item to cart
router.post('/cart/products', async (req, res) => {
  let cart
  // req.session.cartId = null
  // check cookie for cart, if it exist or not
  if (!req.session.cartId) {
    // we dont have a cart, we need to create one
    cart = await cartRepo.create({
      title: 'cart',
      items: []
    })
    // and store cartid on the req.session.cartId

    req.session.cartId = cart.id
    // property
  } else {
    // we have a cart, let get it from repository
    cart = await cartRepo.getOne(req.session.cartId)
  }
  // increment quantity or add new item (item exist or not already)
  const existingItem = cart.items.find(item => item.id === req.body.productId)
  if (existingItem) {
    // increment quantity
    existingItem.quantity++
  } else {
    // add new item
    cart.items.push({ id: req.body.productId, quantity: 1 })
  }
  await cartRepo.update(cart.id, {
    items: cart.items
  })
  res.send('cart done')
})

// recive a GET req to show all items in cart
router.get('/cart', async (req, res) => {
  // check if cart exist
  if (!req.session.cartId) {
    return res.redirect('/')
  }
  // we have cart so retrive the specific cart which is assign to this user via session
  const cart = await cartRepo.getOne(req.session.cartId)
  // iterate items and get ids for each item and get the item from product json file
  for (const item of cart.items) {
    // item==={id: , quantity:}
    const product = await productRepo.getOne(item.id)
    item.product = product
  }
  res.send(cartShowTemplate({ items: cart.items }))
})
// Recieve a post req to delete an item from a
router.post('/cartadd', async (req, res) => {
  res.send('cart added')
})
module.exports = router
