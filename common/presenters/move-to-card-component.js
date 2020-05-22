const i18n = require('../../config/i18n')

const personToCardComponent = require('./person-to-card-component')

function moveToCardComponent({
  isCompact = false,
  showImage = true,
  showMeta = true,
  showTags = true,
  hrefSuffix = '',
} = {}) {
  return function item({ id, reference, person = {}, status }) {
    const href = `/move/${id}${hrefSuffix}`
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
      classes: isCompact
        ? `app-card--compact ${personCardComponent.classes || ''}`
        : personCardComponent.classes || '',
      caption: {
        text: i18n.t('moves::move_reference', {
          reference,
        }),
      },
    }
  }
}

module.exports = moveToCardComponent
