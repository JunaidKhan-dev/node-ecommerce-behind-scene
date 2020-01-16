const express = require('express')
const app = express()
const cookieSession = require('cookie-session')

const authRoutes = require('./routes/admin/auth')
const adminProductsRoutes = require('./routes/admin/products')
const productsRoutes = require('./routes/products')

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: ['abcdefghzyxvwuabcdef']
}))

app.use(authRoutes)
app.use(adminProductsRoutes)
app.use(productsRoutes)

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`)
})
