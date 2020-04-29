const i18n = require('../../config/i18n')

const personToCardComponent = require('./person-to-card-component')

function moveToCardComponent({
  isCompact = false,
  showImage = true,
  showMeta = true,
  showTags = true,
} = {}) {
  return function item({ id, reference, person = {}, status }) {
    const href = `/move/${id}`
    const excludedBadgeStatuses = ['cancelled']
    const statusBadge =
      excludedBadgeStatuses.includes(status) || isCompact
        ? undefined
        : { text: i18n.t(`statuses::${status}`) }
    const personCardComponent = personToCardComponent({
      showImage: isCompact ? false : showImage,
      showMeta: isCompact ? false : showMeta,
      showTags: isCompact ? false : showTags,
    })({
      ...person,
      href,
    })

    return {
      ...personCardComponent,
      status: statusBadge,
      classes: isCompact ? 'app-card--compact' : '',
      caption: {
        html: i18n.t('moves::move_reference', {
          reference,
          context: isCompact ? 'compact' : '',
        }),
      },
    }
  }
}

module.exports = moveToCardComponent
