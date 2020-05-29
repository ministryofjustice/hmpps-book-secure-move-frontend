const { cloneDeep } = require('lodash')

const moveAgreed = require('./move-agreed')

const moveAgreedAssign = cloneDeep(moveAgreed)
moveAgreedAssign.items[1].conditional = 'move_not_agreed_instruction'

module.exports = moveAgreedAssign
