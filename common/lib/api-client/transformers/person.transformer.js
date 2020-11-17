module.exports = function personTransformer(data) {
  return {
    ...data,
    image_url: `/person/${data.id}/image`,
    fullname: [data.last_name, data.first_names].filter(Boolean).join(', '),
  }
}
