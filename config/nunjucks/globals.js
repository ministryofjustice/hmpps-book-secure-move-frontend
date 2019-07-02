const { isFunction } = require('lodash')

const { FEEDBACK_URL } = require('../')
const logger = require('../logger')

module.exports = {
  FEEDBACK_URL,
  SERVICE_NAME: 'Book a secure move',
  callAsMacro (name) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) {
      logger.warn(`'${name}' macro does not exist`)
      return () => ''
    }

    return macro
  },
}
