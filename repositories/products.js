const Repository = require('./repository')

class Products extends Repository {

}

const repo = new Products('products.json')

module.exports = repo
