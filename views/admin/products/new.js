const layout = require('../layout')
const { getErrors } = require('../../../helpers')

module.exports = ({ errors }) => {
  return layout({
    content: `
     <form method='POST' enctype='multipart/form-data'>
      <input name='title' placeholder='Title'/>
      ${}
      <input name='price' placeholder='Price'/>
      <input type='file' name='image' />
      <button type='submit'>Submit</button>
     </form>
    `
  })
}
