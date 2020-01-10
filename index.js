const express = require('express')
const app = express()

const usersRepo = require('./repositories/users')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body
    // check if email already exists
    const existUser = await usersRepo.getOneBy({ email: email })
    if (existUser) {
      return res.send('user already exists')
    }
    // check if password and passwordConfirm are not same
    if (password !== passwordConfirm) return res.send('password not match')
    // create a new user

    res.send('created account')
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})

app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method='POST'>
        <input name='email' placeholder='email'/>
        <input name='password' placeholder='password'/>
        <input name='passwordConfirm' placeholder='password confirm'/>
        <input type='submit' />
      </form>
    </div>
  `)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`)
})
