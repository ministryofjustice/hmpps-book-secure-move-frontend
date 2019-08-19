module.exports = {
  move: {
    attributes: {
      reference: '',
      status: '',
      move_type: '',
      additional_information: '',
      updated_at: '',
      time_due: '',
      date: '',
      person: {
        jsonApi: 'hasOne',
        type: 'people',
      },
      from_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
  person: {
    attributes: {
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
    },
  },
  gender: {
    attributes: {
      key: '',
      title: '',
      description: '',
      nomis_code: '',
      disabled_at: '',
    },
    options: {
      collectionPath: 'reference/genders',
    },
  },
  ethnicity: {
    attributes: {
      key: '',
      title: '',
      description: '',
      nomis_code: '',
      disabled_at: '',
    },
    options: {
      collectionPath: 'reference/ethnicities',
    },
  },
  assessment_question: {
    attributes: {
      created_at: '',
      expires_at: '',
      disabled_at: '',
      key: '',
      title: '',
      category: '',
      nomis_alert_type: '',
      nomis_alert_code: '',
    },
    options: {
      collectionPath: 'reference/assessment_questions',
    },
  },
  location: {
    attributes: {
      key: '',
      title: '',
      location_type: '',
      nomis_agency_id: '',
      disabled_at: '',
    },
    options: {
      collectionPath: 'reference/locations',
    },
  },
}
