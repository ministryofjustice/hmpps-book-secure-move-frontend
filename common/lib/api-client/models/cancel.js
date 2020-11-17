// the endpoint for cancelling allocations is /cancel,
// In order to have a POST to /cancel, it needs to be an entity
module.exports = {
  fields: {
    timestamp: '',
    notes: '',
    cancellation_reason: '',
    cancellation_reason_comment: '',
  },
  options: {
    collectionPath: 'cancel',
  },
}
