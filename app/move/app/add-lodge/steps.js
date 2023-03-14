const { AddLodgeController,
  AddLodgeLocationController ,
  AddLodgeDateController,
  AddLodgeSaveController } = require('./controllers')

module.exports = {
      '/': {
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
      }
  }
