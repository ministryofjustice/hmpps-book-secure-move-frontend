const i18n = require('../../config/i18n')

const profileToCardComponent = require('./profile-to-card-component')

function moveToCardComponent({
  isCompact = false,
  showImage = true,
  showMeta = true,
  showTags = true,
  showStatus = true,
  hrefSuffix = '',
} = {}) {
  return function item({ id, reference, profile, status }) {
    const href = profile ? `/move/${id}${hrefSuffix}` : ''
    const excludedBadgeStatuses = ['cancelled']

    const showStatusBadge =
      showStatus && !excludedBadgeStatuses.includes(status) && !isCompact
    const statusBadge = showStatusBadge
      ? { text: i18n.t(`statuses::${status}`) }
      : undefined
    const personCardComponent = profileToCardComponent({
      showImage: isCompact ? false : showImage,
      showMeta: isCompact ? false : showMeta,
      showTags: isCompact ? false : showTags,
    })({
      ...profile,
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
