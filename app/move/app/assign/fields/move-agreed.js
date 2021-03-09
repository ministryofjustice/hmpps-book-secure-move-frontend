const { cloneDeep } = require('lodash')

const moveAgreed = require('../../../fields/move-agreed')

const moveAgreedAssign = cloneDeep(moveAgreed)
moveAgreedAssign.items[1].conditional = 'move_not_agreed_instruction'

module.exports = moveAgreedAssign
