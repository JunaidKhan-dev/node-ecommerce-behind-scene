const layout = require('../layout')
module.exports = ({req}) => {
  return layout({content: `
    <div>
     Your Id is :  ${req.session.userId}
      <form method='POST'>
        <input name='email' placeholder='email'/>
        <input name='password' placeholder='password'/>
        <input name='passwordConfirm' placeholder='password confirm'/>
        <input type='submit' />
      </form>
    </div>
  `})
}