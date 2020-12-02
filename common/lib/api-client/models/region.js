module.exports = {
  fields: {
    key: '',
    name: '',
    created_at: '',
    updated_at: '',
    locations: {
      jsonApi: 'hasMany',
      type: 'locations',
    },
  },
  options: {
    cache: true,
    collectionPath: 'reference/regions',
  },
}
