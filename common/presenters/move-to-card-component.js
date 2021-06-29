const i18n = require('../../config/i18n')

const moveToImportantEventsTagListComponent = require('./move-to-important-events-tag-list-component')
const profileToCardComponent = require('./profile-to-card-component')

function moveToCardComponent({
  isCompact = false,
  isIdentityCard = false,
  showImage = true,
  showMeta = true,
  showTags = true,
  showStatus = true,
  showToLocation = false,
  showFromLocation = false,
  hrefSuffix = '',
  locationType,
} = {}) {
  return function item(move) {
    const {
      id,
      reference,
      profile,
      status,
      to_location: toLocation,
      from_location: fromLocation,
    } = move
    const href = profile ? `/move/${id}${hrefSuffix}` : ''
    const excludedBadgeStatuses = ['cancelled']

    showTags = isCompact || isIdentityCard ? false : showTags

    const moveMetaItems = []

    if (showFromLocation) {
      moveMetaItems.push({
        label: { text: i18n.t('fields::from_location.label') },
        text: fromLocation?.title,
      })
    }

    if (showToLocation) {
      moveMetaItems.push({
        label: { text: i18n.t('fields::to_location.label') },
        text: toLocation?.title,
      })
    }

    const showStatusBadge =
      showStatus &&
      !excludedBadgeStatuses.includes(status) &&
      !isCompact &&
      !isIdentityCard
    const statusBadge = showStatusBadge
      ? { text: i18n.t(`statuses::${status}`) }
      : undefined
    const personCardComponent = profileToCardComponent({
      locationType,
      meta: moveMetaItems,
      showImage: isCompact ? false : showImage,
      showMeta: isCompact ? false : showMeta,
      showTags,
    })({
      ...profile,
      href: isIdentityCard ? undefined : href,
    })

    let tags

    if (showTags) {
      const importantEventsTagList = moveToImportantEventsTagListComponent(move)
      tags = personCardComponent.tags || []
      tags.push({ items: importantEventsTagList })
    }

    let classes = personCardComponent.classes || ''

    if (isCompact) {
      classes += ' app-card--compact'
    }

    if (isIdentityCard) {
      classes += ' app-card--primary'
    }

    return {
      ...personCardComponent,
      caption: {
        text: i18n.t('moves::move_reference', { reference }),
      },
      classes,
      status: statusBadge,
      ...(tags ? { tags } : undefined),
    }
  }
}

module.exports = moveToCardComponent
