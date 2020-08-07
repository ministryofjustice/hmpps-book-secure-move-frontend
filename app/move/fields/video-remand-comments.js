const { cloneDeep } = require('lodash')

const additionalInformation = require('./additional-information')

module.exports = {
  ...cloneDeep(additionalInformation),
  skip: true,
  name: 'video_remand_comments',
  id: 'video_remand_comments',
}
