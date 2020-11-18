module.exports = {
  fields: {
    date: '',
    operational_capacity: '',
    usable_capacity: '',
    unlock: '',
    bedwatch: '',
    overnights_in: '',
    overnights_out: '',
    out_of_area_courts: '',
    discharges: '',
    free_spaces: '',
    updated_by: '',
    created_at: '',
    updated_at: '',
    location: {
      jsonApi: 'hasOne',
      type: 'location',
    },
    moves_from: {
      jsonApi: 'hasMany',
      type: 'moves',
    },
    moves_to: {
      jsonApi: 'hasMany',
      type: 'moves',
    },
  },
}
