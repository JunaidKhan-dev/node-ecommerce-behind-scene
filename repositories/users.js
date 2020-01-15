const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)
const Respository = require('./repository')

class Users extends Respository {
  async comparePassword (saved, supplied) {
    const [hashedPassword, salt] = saved.split('.')
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64)
    return hashedPassword === hashedSuppliedBuf.toString('hex')
  }

  async create (newUser) {
    newUser.id = this.randomId()
    const records = await this.getAll()
    const salt = crypto.randomBytes(8).toString('hex')
    const hashedBuf = await scrypt(newUser.password, salt, 64)
    const hashedPassword = hashedBuf.toString('hex')
    const user = {
      ...newUser,
      password: `${hashedPassword}.${salt}`

    }
    records.push(user)
    await this.writeAll(records)
    console.log('New Users created')
    return user
  }
}

const repo = new Users('users.json')

module.exports = repo
