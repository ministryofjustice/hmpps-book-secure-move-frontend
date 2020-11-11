const setYouthMove = move => {
  // We have to pretend that 'secure_childrens_home', 'secure_training_centre' are valid `move_type`s
  const youthTransfer = ['secure_childrens_home', 'secure_training_centre']
  const toLocationType = move?.to_location?.location_type
  const fromLocationType = move?.from_location?.location_type

  if (toLocationType === 'prison' && youthTransfer.includes(fromLocationType)) {
    move.move_type = fromLocationType
  }
}

module.exports = setYouthMove
