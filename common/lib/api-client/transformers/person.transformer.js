module.exports = function personTransformer(data) {
  data.image_url = `/person/${data.id}/image`
  data.fullname = [data.last_name, data.first_names].filter(Boolean).join(', ')
}
