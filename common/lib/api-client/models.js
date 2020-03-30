module.exports = {
  move: {
    attributes: {
      reference: '',
      status: '',
      move_type: '',
      move_agreed: '',
      move_agreed_by: '',
      cancellation_reason: '',
      cancellation_reason_comment: '',
      additional_information: '',
      updated_at: '',
      created_at: '',
      time_due: '',
      date: '',
      date_from: '',
      date_to: '',
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
  image: {
    attributes: {
      url: '',
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
  prison_transfer_reason: {
    attributes: {
      title: '',
      key: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/prison_transfer_reasons',
    },
  },
  document: {
    attributes: {
      file: '',
      filename: '',
      content_type: '',
      url: '',
      filesize: '',
    },
  },
}
