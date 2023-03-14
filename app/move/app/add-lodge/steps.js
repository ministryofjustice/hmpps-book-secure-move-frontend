const { AddLodgeController,
  AddLodgeLocationController ,
  AddLodgeDateController,
  AddLodgeSaveController } = require('./controllers')

const addLodgeSteps = {
      '/': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        next: 'new',
      },
      '/new': {
        controller: AddLodgeController.AddLodgeController,
        pageTitle: 'moves::steps.lodge.location.heading',
        skip: true,
        next: 'location',
      },
      '/location': {
        controller: AddLodgeLocationController.AddLodgeLocationController,
        pageTitle: 'moves::steps.lodge.location.heading',
        fields: ['to_location_lodge'],
        next: 'date',
      },
      '/date': {
        controller: AddLodgeDateController.AddLodgeDateController,
        pageTitle: 'moves::steps.lodge.date.heading',
        fields: ['date_type_lodge'],
        next: 'save-lodge',
      },
      '/save': {
        skip: true,
        controller: AddLodgeSaveController.AddLodgeSaveController,
      }
  }

module.exports = addLodgeSteps
