const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

class Users {
  constructor (filename) {
    if (!filename) throw new Error('filename is required!')
    this.filename = filename
    this.dirPath = path.join(`${__dirname}/../store`)
    try {
      fs.readFileSync(`${this.dirPath}/${this.filename}`)
    } catch (error) {
      fs.writeFileSync(`${this.dirPath}/${this.filename}`, '[]')
    }
  }

  async getAll () {
    return JSON.parse(await fs.promises.readFile(`${this.dirPath}/${this.filename}`, { encoding: 'utf-8' }))
  }

  async writeAll (data) {
    try {
      await fs.promises.writeFile(`${this.dirPath}/${this.filename}`, JSON.stringify(data, null, 2))
    } catch (error) {
      throw new Error('Write Error', error)
    }
  }

  randomId () {
    return crypto.randomBytes(4).toString('hex')
  }

  async create (newUser) {
    newUser.id = this.randomId()
    const records = await this.getAll()
    records.push(newUser)
    await this.writeAll(records)
    console.log('New Users created')
  }

  async getOne (id) {
    const records = await this.getAll()
    const record = records.find(record => record.id === id)
    return record
  }

  async delete (id) {
    const records = await this.getAll()
    const filteredRecords = records.filter(record => record.id !== id)
    await this.writeAll(filteredRecords)
  }

  async update (id, newRecord) {
    try {
      const records = await this.getAll()
      const findCheck = records.find(record => record.id === id)
      if (!findCheck) {
        throw new Error('Wrong ID')
      }
      const updatedRecords = records.map(record => {
        if (record.id === id) {
          return { ...record, ...newRecord }
        }
        return record
      })

      await this.writeAll(updatedRecords)
    } catch (error) {
      console.log(error)
    }
  }

  async getOneBy (filters) {
    const records = await this.getAll()
    let reqRecord = null
    Object.keys(filters).forEach(key => {
      reqRecord = records.find(reqRecord => reqRecord[key] === filters[key])
    })

    return reqRecord
  }
}

const test = async () => {
  const newUserFile = new Users('users.json')
  // await newUserFile.create({ email: 'test@test.com', password: 1234 })
  // const records = await newUserFile.getAll()
  // console.log('process done', records)
  // const user = await newUserFile.getOne('1df3bef1')
  // await newUserFile.delete('1df3bef1')
  // await newUserFile.update('98e786', { password: 'my new pass' })
  // const user = await newUserFile.getOneBy({ id: 'd9e244bc' })
  // console.log('user?:', user)
}

test()
