module.exports = {
  fields: {
    key: '',
    title: '',
    location_type: '',
    nomis_agency_id: '',
    can_upload_documents: '',
    disabled_at: '',
    suppliers: {
      jsonApi: 'hasMany',
      type: 'suppliers',
    },
  },
  options: {
    cache: true,
    collectionPath: 'reference/locations',
  },
}
