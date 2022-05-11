const { isEmpty, pickBy } = require('lodash')

const { FRAMEWORKS } = require('../../config')

const BaseService = require('./base')

const noIdMessage = 'No resource ID supplied'

class PersonEscortRecordService extends BaseService {
  create(moveId) {
    return this.apiClient
      .create('person_escort_record', {
        version: FRAMEWORKS.CURRENT_VERSION,
        move: {
          id: moveId,
        },
      })
      .then(response => response.data)
  }

  confirm(
    id,
    {
      handoverOccurredAt,
      dispatchingOfficer,
      dispatchingOfficerId,
      dispatchingOfficerContact,
      receivingOfficer,
      receivingOfficerId,
      receivingOfficerContact,
      receivingOrganisation,
      locationId,
    } = {}
  ) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    const handoverDetails = pickBy({
      dispatching_officer: dispatchingOfficer,
      dispatching_officer_id: dispatchingOfficerId,
      dispatching_officer_contact: dispatchingOfficerContact,
      receiving_officer: receivingOfficer,
      receiving_officer_id: receivingOfficerId,
      receiving_officer_contact: receivingOfficerContact,
      receiving_organisation: receivingOrganisation,
      location_id: locationId,
    })

    return this.apiClient
      .update(
        'person_escort_record',
        pickBy({
          id,
          status: 'confirmed',
          handover_occurred_at: handoverOccurredAt,
          handover_details: !isEmpty(handoverDetails)
            ? handoverDetails
            : undefined,
        })
      )
      .then(response => response.data)
  }

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    const include = [
      'profile',
      'profile.person',
      'framework',
      'responses',
      'responses.question',
      'responses.question.descendants.**',
      'responses.nomis_mappings',
      'flags',
      'prefill_source',
      'move',
    ]

    return this.apiClient
      .find('person_escort_record', id, { include })
      .then(response => response.data)
  }

  respond(id, data = []) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    if (data.length === 0) {
      return Promise.resolve([])
    }

    return this.apiClient
      .one('person_escort_record', id)
      .all('framework_response')
      .patch(data)
  }
}

module.exports = PersonEscortRecordService
