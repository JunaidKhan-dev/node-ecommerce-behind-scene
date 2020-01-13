const layout = require('../layout')

const getError = (errors, prop) => {
  // props === 'email' || 'password' || 'passwordConfirm'
  try {
    // errors.mapped() provide us {email:{}, password:{}, passwordConfirm:{} }
    return errors.mapped()[prop].msg
  } catch (err) {
    return ''
  }
}
module.exports = ({ errors }) => {
  return layout({
    content: `
     <div>
      <form method='POST'>
        <input name='email' placeholder='email'/>
        ${getError(errors, 'email')}
        <input name='password' placeholder='password'/>
          ${getError(errors, 'password')}
        <input type='submit' />
      </form>
    </div>
  `
  })
}
