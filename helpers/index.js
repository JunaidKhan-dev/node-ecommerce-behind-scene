const getErrors = (errors, prop) => {
  // props === 'email' || 'password' || 'passwordConfirm'
  try {
    // errors.mapped() provide us {email:{}, password:{}, passwordConfirm:{} }
    return errors.mapped()[prop].msg
  } catch (err) {
    return ''
  }
}

module.exports = {
  getErrors
}
