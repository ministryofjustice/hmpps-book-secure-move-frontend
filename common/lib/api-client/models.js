module.exports = {
  allocation: {
    attributes: {
      complete_in_full: false,
      complex_cases: [],
      created_at: '',
      date: '',
      events: {
        jsonApi: 'hasMany',
        type: 'events',
      },
      from_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      moves: {
        jsonApi: 'hasMany',
        type: 'moves',
      },
      moves_count: 0,
      other_criteria: '',
      prisoner_category: '',
      sentence_length: '',
      status: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      updated_at: '',
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
  assessment_question: {
    attributes: {
      category: '',
      disabled_at: '',
      key: '',
      nomis_alert_code: '',
      nomis_alert_type: '',
      title: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/assessment_questions',
    },
  },
  court_case: {
    attributes: {
      case_number: '',
      case_start_date: '',
      case_type: '',
      location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      nomis_case_id: '',
      nomis_case_status: '',
    },
  },
  court_hearing: {
    attributes: {
      case_number: '',
      case_start_date: '',
      case_type: '',
      comments: '',
      move: {
        jsonApi: 'hasOne',
        type: 'moves',
      },
      nomis_case_id: '',
      nomis_hearing_id: '',
      saved_to_nomis: '',
      start_time: '',
    },
  },
  document: {
    attributes: {
      content_type: '',
      file: '',
      filename: '',
      filesize: '',
      url: '',
    },
  },
  ethnicity: {
    attributes: {
      description: '',
      disabled_at: '',
      key: '',
      nomis_code: '',
      title: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/ethnicities',
    },
  },
  event: {
    attributes: {
      event_name: '',
      notes: '',
      timestamp: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
  gender: {
    attributes: {
      description: '',
      disabled_at: '',
      key: '',
      nomis_code: '',
      title: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/genders',
    },
  },
  image: {
    attributes: {
      url: '',
    },
  },
  location: {
    attributes: {
      can_upload_documents: '',
      disabled_at: '',
      key: '',
      location_type: '',
      nomis_agency_id: '',
      suppliers: {
        jsonApi: 'hasMany',
        type: 'suppliers',
      },
      title: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/locations',
    },
  },
  move: {
    attributes: {
      additional_information: '',
      allocation: {
        jsonApi: 'hasOne',
        type: 'allocations',
      },
      cancellation_reason: '',
      cancellation_reason_comment: '',
      court_hearings: {
        jsonApi: 'hasMany',
        type: 'court_hearings',
      },
      created_at: '',
      date: '',
      date_from: '',
      date_to: '',
      documents: {
        jsonApi: 'hasMany',
        type: 'documents',
      },
      from_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      move_agreed: '',
      move_agreed_by: '',
      move_type: '',
      person: {
        jsonApi: 'hasOne',
        type: 'people',
      },
      prison_transfer_reason: {
        jsonApi: 'hasOne',
        type: 'prison_transfer_reasons',
      },
      reference: '',
      status: '',
      time_due: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      updated_at: '',
    },
  },
  person: {
    attributes: {
      assessment_answers: '',
      date_of_birth: '',
      ethnicity: {
        jsonApi: 'hasOne',
        type: 'ethnicities',
      },
      first_names: '',
      gender: {
        jsonApi: 'hasOne',
        type: 'genders',
      },
      gender_additional_information: '',
      identifiers: '',
      last_name: '',
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
  redirect: {
    attributes: {
      notes: '',
      timestamp: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
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
  timetable_entry: {
    attributes: {
      location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      nomis_type: '',
      reason: '',
      start_time: '',
    },
    options: {
      collectionPath: 'timetable',
    },
  },
}
