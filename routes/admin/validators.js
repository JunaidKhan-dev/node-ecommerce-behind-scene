const { check } = require('express-validator')
const usersRepo = require('../../repositories/users')

const requireEmail = check('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('provide valid email')
  .custom(async (email) => {
    // custom function trigger a callback function get two parameters
    // 1. the value which you put the check and object contains req object
    // 2. this function need to do two things throw error if not valid otherwise return true
    // check if email already exists
    const user = await usersRepo.getOneBy({ email: email })
    if (user) {
      throw new Error('Email already exists')
    }

    return true
  })

const checkPassword = check('password').trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Must be Between 4 and 20 Chararcter')

const checkPasswordConfirmation = check('passwordConfirm')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Must be Between 4 and 20 Chararcter')
  .custom((passwordConfirm, { req }) => {
    if (passwordConfirm !== req.body.password) throw new Error('password not Match!')
    return true
  })
module.exports = {
  requireEmail,
  checkPassword,
  checkPasswordConfirmation
}
