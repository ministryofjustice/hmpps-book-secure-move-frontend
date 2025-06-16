const { cloneDeep } = require('lodash')

const createFields = require('../../new/fields')

const policeNationalComputer = require('./police-national-computer')
const dateChangedReason = require('./date-changed-reason')

const fields = {
  ...cloneDeep(createFields),
  police_national_computer: policeNationalComputer,
  date_changed_reason: dateChangedReason,
}

module.exports = fields
