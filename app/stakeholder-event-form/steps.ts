import {
  StakeholderEvent,
  SaveController,
  RedirectController
} from './controllers'

const steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'stakeholder'
  },
  '/stakeholder': {
    fields: ['stakeholder_group'],
    next: 'details'
  },
  '/details': {
    pageTitle: 'Describe the event',
    fields: ['event_date', 'event_time', 'event_summary', 'further_details'],
    controller: StakeholderEvent,
    buttonText: 'Save event',
    next: 'save'
  },
  '/save': {
    skip: true,
    controller: SaveController,
    next: 'complete'
  },
  '/complete': {
    controller: RedirectController,
    checkJourney: false,
    noPost: true,
    skip: true
    //reset: true,
   // resetJourney: true
  }
}

export default steps
