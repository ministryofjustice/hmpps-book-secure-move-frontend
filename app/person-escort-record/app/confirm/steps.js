const { HandoverController } = require('./controllers')

const single = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'handover',
  },
  '/handover': {
    checkJourney: false,
    controller: HandoverController,
    fields: [
      'confirm_handover',
      'handover_dispatching_officer',
      'handover_dispatching_officer_id',
      'handover_dispatching_officer_contact',
      'handover_receiving_officer',
      'handover_receiving_officer_id',
      'handover_receiving_officer_contact',
      'handover_receiving_organisation',
      'handover_other_organisation',
      'handover_occurred_at',
      'handover_other_date',
      'handover_other_time',
    ],
    buttonText: 'actions::confirm_handover',
    pageTitle: 'assessment::handover.heading',
    templatePath: 'person-escort-record/app/confirm',
    template: 'handover-details',
  },
}

module.exports = single
