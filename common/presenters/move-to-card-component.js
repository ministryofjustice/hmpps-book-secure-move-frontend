const i18n = require('../../config/i18n')

const personToCardComponent = require('./person-to-card-component')

function moveToCardComponent({ showMeta = true, showTags = true } = {}) {
  return function item({ id, reference, person = {}, status }) {
    const href = `/move/${id}`
    const excludedBadgeStatuses = ['cancelled']
    const statusBadge = excludedBadgeStatuses.includes(status)
      ? undefined
      : { text: i18n.t(`statuses::${status}`) }
    const personCardComponent = personToCardComponent({ showMeta, showTags })({
      ...person,
      href,
    })

    return {
      ...personCardComponent,
      status: statusBadge,
      caption: {
        text: i18n.t('moves::move_reference', {
          reference,
        }),
      },
    }
  }
}

module.exports = moveToCardComponent
