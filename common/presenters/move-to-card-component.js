const i18n = require('../../config/i18n')

const moveToImportantEventsTagListComponent = require('./move-to-important-events-tag-list-component')
const profileToCardComponent = require('./profile-to-card-component')

function moveToCardComponent({
  isCompact = false,
  showImage = true,
  showMeta = true,
  showTags = true,
  tagSource,
  showStatus = true,
  hrefSuffix = '',
} = {}) {
  return function item(move) {
    const { id, reference, profile, status } = move
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
      tagSource,
    })({
      ...profile,
      href,
    })

    // TODO: only include this is showTags is true???
    const importantEventsTagList = moveToImportantEventsTagListComponent(move)

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
      importantEventsTagList,
    }
  }
}

module.exports = moveToCardComponent
