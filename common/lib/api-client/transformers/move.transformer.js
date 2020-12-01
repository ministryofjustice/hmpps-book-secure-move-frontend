module.exports = function moveTransformer(data) {
  const isYouthMove = [
    'secure_training_centre',
    'secure_childrens_home',
  ].includes(data.from_location?.location_type)

  return {
    ...data,
    _is_youth_move: isYouthMove,
  }
}
