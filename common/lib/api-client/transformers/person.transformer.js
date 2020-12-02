module.exports = function personTransformer(data) {
  data._image_url = `/person/${data.id}/image`
  data._fullname = [data.last_name, data.first_names].filter(Boolean).join(', ')
}
