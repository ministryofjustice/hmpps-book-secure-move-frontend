module.exports = {
  fields: {
    key: '',
    title: '',
    location_type: '',
    nomis_agency_id: '',
    can_upload_documents: '',
    extradition_capable: '',
    young_offender_institution: '',
    latitude: '',
    longitude: '',
    premise: '',
    locality: '',
    city: '',
    country: '',
    postcode: '',
    disabled_at: '',
    suppliers: {
      jsonApi: 'hasMany',
      type: 'suppliers',
    },
    category: {
      jsonApi: 'hasOne',
      type: 'categories',
    },
  },
  options: {
    cache: true,
    collectionPath: 'reference/locations',
  },
}
