const { cloneDeep } = require('lodash')

const createFields = require('../../new/fields')

const moveAgreed = require('./move-agreed')
const moveNotAgreedInstruction = require('./move-not-agreed-instruction')
const specialVehicleCheck = require('./special-vehicle-check')

const fields = {
  ...cloneDeep(createFields),
  move_agreed: moveAgreed,
  move_not_agreed_instruction: moveNotAgreedInstruction,
  special_vehicle_check: specialVehicleCheck,
}

module.exports = fields
