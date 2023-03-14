const AddLodgeController = require('./controllers/add-lodge')
const AddLodgeLocationController = require('./controllers/add-lodge-location')
const AddLodgeDateController = require('./controllers/add-lodge-date')
const AddLodgeSaveController  = require('./controllers/add-lodge-save')

module.exports =
  {
    key: 'lodge',
    permission: 'move:update',
    controller: AddLodgeController,
    steps: {
      '/lodge': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        controller: AddLodgeController,
        next: 'lodge-location',
      },
      '/lodge-location': {
        controller: AddLodgeLocationController,
        pageTitle: 'moves::steps.lodge.location.heading',
        fields: ['to_location_lodge'],
        next: 'lodge-date',
      },
      '/lodge-date': {
        controller: AddLodgeDateController,
        pageTitle: 'moves::steps.lodge.date.heading',
        fields: ['date_type_lodge'],
        next: 'save-lodge',
      },
      '/save-lodge': {
        skip: true,
        controller: AddLodgeSaveController,
      },
    },
  }
