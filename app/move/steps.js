const {
  PersonalDetails,
  Assessment,
  MoveDetails,
  Save,
} = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'personal-details',
  },
  '/personal-details': {
    controller: PersonalDetails,
    backLink: null,
    pageTitle: 'moves::steps.personal_details.heading',
    next: 'move-details',
    fields: [
      'police_national_computer',
      'last_name',
      'first_names',
      'date_of_birth',
      'ethnicity',
      'gender',
      'gender_additional_information',
    ],
  },
  '/move-details': {
    controller: MoveDetails,
    template: 'move/views/new/move-details',
    pageTitle: 'moves::steps.move_details.heading',
    next: [
      {
        field: 'move_type',
        value: 'court_appearance',
        next: 'court-information',
      },
      'risk-information',
    ],
    fields: [
      'from_location',
      'to_location',
      'move_type',
      'to_location_court_appearance',
      'to_location_prison_recall',
      'date',
      'date_type',
      'date_custom',
    ],
  },
  '/court-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.court_information.heading',
    next: 'risk-information',
    fields: [
      'court',
      'court__solicitor',
      'court__interpreter',
      'court__other_court',
    ],
  },
  '/risk-information': {
    controller: Assessment,
    pageTitle: 'moves::steps.risk_information.heading',
    next: 'health-information',
    fields: [
      'risk',
      'risk__violent',
      'risk__escape',
      'risk__hold_separately',
      'risk__self_harm',
      'risk__concealed_items',
      'risk__other_risks',
    ],
  },
  '/health-information': {
    controller: Assessment,
    next: 'save',
    pageTitle: 'moves::steps.health_information.heading',
    buttonText: 'actions::schedule_move',
    fields: [
      'health',
      'health__special_diet_or_allergy',
      'health__health_issue',
      'health__medication',
      'health__wheelchair',
      'health__pregnant',
      'health__other_health',
    ],
  },
  '/save': {
    skip: true,
    controller: Save,
  },
}
