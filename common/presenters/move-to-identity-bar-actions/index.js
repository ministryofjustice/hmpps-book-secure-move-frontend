const config = require('../../../config')
const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

const assessmentActions = require('./assessment-actions')

function moveToIdentityBarActions(move = {}, { canAccess = () => false } = {}) {
  const profile = move.profile

  // An allocation witout a person attached
  if (!profile) {
    if (!canAccess('allocation:person:assign')) {
      return []
    }

    return [
      {
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::add_person_to_move'),
          preventDoubleClick: true,
          href: `/move/${move.id}/assign`,
        }),
      },
    ]
  }

  // A single request that still needs to be reviewed
  if (move.status === 'proposed' && canAccess('move:review')) {
    return [
      {
        html: componentService.getComponent('govukButton', {
          text: i18n.t('actions::review'),
          preventDoubleClick: true,
          href: `/move/${move.id}/review`,
        }),
      },
    ]
  }

  // Person Escort Record/Youth Risk Assessment specific actions
  return assessmentActions(move, { canAccess }, config.FEATURE_FLAGS)
}

module.exports = moveToIdentityBarActions
