module.exports = function moveTransformer(data) {
  const youthTransfer = ['secure_childrens_home', 'secure_training_centre']
  const locationType = data.to_location?.location_type

  if (youthTransfer.includes(locationType)) {
    data.move_type = locationType
  }

  return data
}
