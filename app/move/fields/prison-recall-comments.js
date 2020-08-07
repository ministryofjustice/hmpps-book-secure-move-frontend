const { cloneDeep } = require('lodash')

const additionalInformation = require('./additional-information')

module.exports = {
  ...cloneDeep(additionalInformation),
  skip: true,
  name: 'prison_recall_comments',
  id: 'prison_recall_comments',
}
