const { transformResource, personTransformer } = require('../transformers')

module.exports = {
  fields: {
    first_names: '',
    last_name: '',
    date_of_birth: '',
    identifiers: '',
    assessment_answers: '',
    gender_additional_information: '',
    gender: {
      jsonApi: 'hasOne',
      type: 'genders',
    },
    ethnicity: {
      jsonApi: 'hasOne',
      type: 'ethnicities',
    },
    prison_number: '',
    criminal_records_office: '',
    police_national_computer: '',
    profiles: {
      jsonApi: 'hasMany',
      type: 'profiles',
    },
  },
  options: {
    defaultInclude: ['ethnicity', 'gender'],
    deserializer: transformResource(personTransformer),
  },
}
