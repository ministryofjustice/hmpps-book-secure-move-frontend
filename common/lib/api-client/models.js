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
      prison_transfer_reason: {
        jsonApi: 'hasOne',
        type: 'prison_transfer_reasons',
      },
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
        type: 'documents',
      },
      court_hearings: {
        jsonApi: 'hasMany',
        type: 'court_hearings',
      },
      allocation: {
        jsonApi: 'hasOne',
        type: 'allocations',
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
  court_case: {
    attributes: {
      nomis_case_id: '',
      nomis_case_status: '',
      case_start_date: '',
      case_type: '',
      case_number: '',
      location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
  court_hearing: {
    attributes: {
      start_time: '',
      case_number: '',
      case_type: '',
      case_start_date: '',
      comments: '',
      nomis_case_id: '',
      nomis_hearing_id: '',
      saved_to_nomis: '',
      move: {
        jsonApi: 'hasOne',
        type: 'moves',
      },
    },
  },
  timetable_entry: {
    attributes: {
      start_time: '',
      nomis_type: '',
      reason: '',
      location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
    options: {
      collectionPath: 'timetable',
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
      disabled_at: '',
      key: '',
      title: '',
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
  allocation: {
    attributes: {
      from_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      date: '',
      prisoner_category: '',
      sentence_length: '',
      complex_cases: [],
      moves_count: 0,
      complete_in_full: false, // boolean
      other_criteria: '',
      created_at: '',
      updated_at: '',
      status: '',
      moves: {
        jsonApi: 'hasMany',
        type: 'moves',
      },
      events: {
        jsonApi: 'hasMany',
        type: 'events',
      },
    },
  },
  allocation_complex_case: {
    attributes: {
      disabled_at: '',
      key: '',
      title: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/allocation_complex_cases',
    },
  },
  event: {
    attributes: {
      event_name: '',
      timestamp: '',
      notes: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
  redirect: {
    attributes: {
      timestamp: '',
      notes: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
}
