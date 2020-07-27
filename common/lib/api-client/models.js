module.exports = {
  move: {
    fields: {
      reference: '',
      status: '',
      move_type: '',
      move_agreed: '',
      move_agreed_by: '',
      rejection_reason: '',
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
      profile: {
        jsonApi: 'hasOne',
        type: 'profiles',
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
    options: {
      defaultInclude: [
        'allocation',
        'court_hearings',
        'from_location',
        'from_location.suppliers',
        'prison_transfer_reason',
        'profile',
        'profile.documents',
        'profile.person_escort_record',
        'profile.person_escort_record.flags',
        'profile.person',
        'profile.person.ethnicity',
        'profile.person.gender',
        'to_location',
      ],
    },
  },
  image: {
    fields: {
      url: '',
    },
  },
  person: {
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
    },
  },
  profile: {
    fields: {
      assessment_answers: '',
      person: {
        jsonApi: 'hasOne',
        type: 'people',
      },
      documents: {
        jsonApi: 'hasMany',
        type: 'documents',
      },
      person_escort_record: {
        jsonApi: 'hasOne',
        type: 'person_escort_records',
      },
    },
    options: {
      defaultInclude: ['person', 'documents'],
    },
  },
  court_case: {
    fields: {
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
    options: {
      defaultInclude: ['location'],
    },
  },
  court_hearing: {
    fields: {
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
    fields: {
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
      defaultInclude: ['location'],
    },
  },
  gender: {
    fields: {
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
    fields: {
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
    fields: {
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
      defaultInclude: ['suppliers'],
    },
  },
  region: {
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
      defaultInclude: ['locations'],
    },
  },
  supplier: {
    fields: {
      key: '',
      name: '',
    },
    options: {
      cache: true,
      collectionPath: 'reference/suppliers',
    },
  },
  prison_transfer_reason: {
    fields: {
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
    fields: {
      file: '',
      filename: '',
      content_type: '',
      url: '',
      filesize: '',
    },
  },
  allocation: {
    fields: {
      from_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
      estate: '',
      estate_comment: '',
      date: '',
      prisoner_category: '',
      sentence_length: '',
      sentence_length_comment: '',
      complex_cases: [],
      moves_count: 0,
      complete_in_full: false, // boolean
      other_criteria: '',
      created_at: '',
      updated_at: '',
      status: '',
      cancellation_reason: '',
      cancellation_reason_comment: '',
      requested_by: '',
      moves: {
        jsonApi: 'hasMany',
        type: 'moves',
      },
      events: {
        jsonApi: 'hasMany',
        type: 'events',
      },
    },
    options: {
      defaultInclude: [
        'from_location',
        'moves',
        'moves.profile',
        'moves.profile.person',
        'moves.profile.person.ethnicity',
        'moves.profile.person.gender',
        'to_location',
      ],
    },
  },
  allocation_complex_case: {
    fields: {
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
    fields: {
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
    fields: {
      timestamp: '',
      notes: '',
      to_location: {
        jsonApi: 'hasOne',
        type: 'locations',
      },
    },
  },
  // the endpoint for cancelling allocations is /cancel,
  // In order to have a POST to /cancel, it needs to be an entity
  cancel: {
    fields: {
      timestamp: '',
      notes: '',
      cancellation_reason: '',
      cancellation_reason_comment: '',
    },
    options: {
      collectionPath: 'cancel',
    },
  },
  reject: {
    fields: {
      timestamp: '',
      notes: '',
      rejection_reason: '',
      cancellation_reason_comment: '',
      rebook: '',
    },
    options: {
      collectionPath: 'reject',
    },
  },
  person_escort_record: {
    fields: {
      status: '',
      version: '',
      profile: {
        jsonApi: 'hasOne',
        type: 'profiles',
      },
      framework: {
        jsonApi: 'hasOne',
        type: 'frameworks',
      },
      responses: {
        jsonApi: 'hasMany',
        type: 'framework_responses',
      },
      flags: {
        jsonApi: 'hasMany',
        type: 'framework_flags',
      },
    },
    options: {
      defaultInclude: [
        'profile',
        'profile.person',
        'framework',
        'responses',
        'responses.question',
        'flags',
      ],
    },
  },
  framework: {
    fields: {
      version: '',
      name: '',
      questions: {
        jsonApi: 'hasMany',
        type: 'framework_questions',
      },
    },
  },
  framework_flag: {
    fields: {
      title: '',
      flag_type: '',
      question_value: '',
      question: {
        jsonApi: 'hasOne',
        type: 'framework_questions',
      },
    },
  },
  framework_question: {
    fields: {
      key: '',
      section: '',
      options: '',
      question_type: '',
      framework: {
        jsonApi: 'hasOne',
        type: 'frameworks',
      },
    },
  },
  framework_response: {
    fields: {
      value: '',
      value_type: '',
      responded: '',
      person_escort_record: {
        jsonApi: 'hasOne',
        type: 'person_escort_records',
      },
      question: {
        jsonApi: 'hasOne',
        type: 'framework_questions',
      },
      flags: {
        jsonApi: 'hasMany',
        type: 'framework_flags',
      },
    },
    options: {
      defaultInclude: ['person_escort_record', 'question'],
    },
  },
}
