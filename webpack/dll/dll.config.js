if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dll.prod.config')
} else {
  module.exports = require('./dll.dev.config')
}
