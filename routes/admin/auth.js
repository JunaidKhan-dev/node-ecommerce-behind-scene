const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const usersRepo = require('../../repositories/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')
const { requireEmail, checkPassword, checkPasswordConfirmation } = require('./validators')

router.post('/signup', [
  requireEmail,
  checkPassword,
  checkPasswordConfirmation
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return (
      res.send(signupTemplate({ req: req, errors: errors }))
    )
  }
  const { email, password } = req.body

  // create a new user in our DB
  // create a hasing password with salt

  const newUser = await usersRepo.create({ email: email, password: password })
  // take the id of the user and add into user cookie, and set that cookie to browser to use in future request to our server
  // req.session session object is added by cookie-session libraray

  req.session.userId = newUser.id

  res.redirect('/admin/products')
})

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }))
})

router.get('/signout', (req, res) => {
  req.session = null
  res.send('you are logged out')
})

router.post('/signin', [
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('must provide a valid email')
    .custom(async (email) => {
      // check if user exist
      const user = await usersRepo.getOneBy({ email: email })
      if (!user) {
        throw new Error('Email not exist!')
      }

      return true
    }),
  check('password')
    .trim()
    .custom(async (password, { req }) => {
      // check the provide password is same as user DB passowrd
      const user = await usersRepo.getOneBy({ email: req.body.email })
      if (!user) {
        throw new Error('password invalid')
      }
      const validPassword = await usersRepo.comparePassword(user.password, password)
      if (!validPassword) throw new Error('password invalid')

      return true
    })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors: errors }))
    }
    const { email } = req.body

    // assign cookie for next request
    const user = await usersRepo.getOneBy({ email: email })
    req.session.userId = user.id

    res.redirect('/admin/products')
  } catch (error) {
    res.send(error.message)
  }
})

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}))
})

module.exports = router
