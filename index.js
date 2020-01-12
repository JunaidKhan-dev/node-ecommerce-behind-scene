const express = require('express')
const app = express()
const cookieSession = require('cookie-session')

const usersRepo = require('./repositories/users')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: ['abcdefghzyxvwuabcdef']
}))

app.post('/signup', async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body
    // check if email already exists
    const user = await usersRepo.getOneBy({ email: email })
    if (user) {
      return res.send('user already exists')
    }
    // check if password and passwordConfirm are not same
    if (password !== passwordConfirm) {
      return res.send('password not match')
    }
    // create a new user in our DB
    // create a hasing password with salt

    const newUser = await usersRepo.create({ email: email, password: password })
    // take the id of the user and add into user cookie, and set that cookie to browser to use in future request to our server
    // req.session session object is added by cookie-session libraray

    req.session.userId = newUser.id

    res.send('created account')
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})

app.get('/signup', (req, res) => {
  res.send(`
    <div>
     Your Id is :  ${req.session.userId}
      <form method='POST'>
        <input name='email' placeholder='email'/>
        <input name='password' placeholder='password'/>
        <input name='passwordConfirm' placeholder='password confirm'/>
        <input type='submit' />
      </form>
    </div>
  `)
})

app.get('/signout', (req, res) => {
  req.session = null
  res.send('you are logged out')
})

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user exist
    const user = await usersRepo.getOneBy({ email: email })
    console.log('user exists', user)

    if (!user) {
      return res.send('user not exists')
    }

    // check the provide password is same as user DB passowrd
    const validPassword = await usersRepo.comparePassword(user.password, password)
    if (!validPassword) return res.send('password invalid')

    // assign cookie for next request

    req.session.userId = user.id

    res.send('you are signed in')
  } catch (error) {
    res.send(error.message)
  }
})

app.get('/signin', (req, res) => {
  res.send(`
     <div>
      <form method='POST'>
        <input name='email' placeholder='email'/>
        <input name='password' placeholder='password'/>
        <input type='submit' />
      </form>
    </div>
  `)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`)
})
