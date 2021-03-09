const { cloneDeep } = require('lodash')

const { createFields } = require('../../../fields')

const policeNationalComputer = require('./police-national-computer')

const fields = {
  ...cloneDeep(createFields),
  police_national_computer: policeNationalComputer,
}

module.exports = fields
