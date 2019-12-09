module.exports = {
  move: {
    attributes: {
      reference: '',
      status: '',
      move_type: '',
      cancellation_reason: '',
      cancellation_reason_comment: '',
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
      documents: {
        jsonApi: 'hasMany',
        type: 'document',
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
      cache: true,
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
      cache: true,
      collectionPath: 'reference/ethnicities',
    },
  },
  assessment_question: {
    attributes: {
      disabled_at: '',
      key: '',
      title: '',
      category: '',
      nomis_alert_type: '',
      nomis_alert_code: '',
    },
    options: {
      cache: true,
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
      suppliers: {
        jsonApi: 'hasMany',
        type: 'suppliers',
      },
    },
    options: {
      cache: true,
      collectionPath: 'reference/locations',
    },
  },
  supplier: {
    attributes: {
      key: '',
      name: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/suppliers',
    },
  },
  document: {
    attributes: {
      id: '',
      filename: '',
      content_type: '',
      url: '',
    },
  },
}
