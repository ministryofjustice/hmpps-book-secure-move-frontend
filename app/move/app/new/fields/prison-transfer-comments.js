const { cloneDeep } = require('lodash')

const additionalInformation = require('./additional-information')

module.exports = {
  ...cloneDeep(additionalInformation),
  name: 'prison_transfer_comments',
  id: 'prison_transfer_comments',
}
