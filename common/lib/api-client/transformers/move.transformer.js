const { get } = require('lodash')

module.exports = function moveTransformer(data) {
  const fromLocationType = get(data, 'from_location.location_type')
  const isYouthMove = [
    'secure_training_centre',
    'secure_childrens_home',
  ].includes(fromLocationType)

  data._is_youth_move = isYouthMove
}
