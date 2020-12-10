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

    showTags = isCompact ? false : showTags

    const showStatusBadge =
      showStatus && !excludedBadgeStatuses.includes(status) && !isCompact
    const statusBadge = showStatusBadge
      ? { text: i18n.t(`statuses::${status}`) }
      : undefined
    const personCardComponent = profileToCardComponent({
      showImage: isCompact ? false : showImage,
      showMeta: isCompact ? false : showMeta,
      showTags,
      tagSource,
    })({
      ...profile,
      href,
    })

    let tags

    if (showTags) {
      const importantEventsTagList = moveToImportantEventsTagListComponent(move)
      tags = personCardComponent.tags || []
      tags.push({ items: importantEventsTagList })
    }

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
      ...(tags ? { tags } : undefined),
    }
  }
}

module.exports = moveToCardComponent
