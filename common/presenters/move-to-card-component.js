const i18n = require('../../config/i18n').default

const moveToImportantEventsTagListComponent = require('./move-to-important-events-tag-list-component')
const profileToCardComponent = require('./profile-to-card-component')

function moveToCardComponent({
  isCompact = false,
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
      date,
      id,
      reference,
      profile,
      status,
      to_location: toLocation,
      from_location: fromLocation,
    } = move
    const href = profile ? `/move/${id}${hrefSuffix}` : ''
    const excludedBadgeStatuses = ['cancelled']

    showTags = isCompact ? false : showTags

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
      showStatus && !excludedBadgeStatuses.includes(status) && !isCompact
    const statusBadge = showStatusBadge
      ? { text: i18n.t(`statuses::${status}`) }
      : undefined
    const assessmentType =
      move.profile?.requires_youth_risk_assessment &&
      move.profile?.youth_risk_assessment?.status !== 'confirmed'
        ? 'youth_risk_assessment'
        : 'person_escort_record'

    const personCardComponent = profileToCardComponent({
      locationType,
      meta: moveMetaItems,
      showImage: isCompact ? false : showImage,
      showMeta: isCompact ? false : showMeta,
      showTags,
    })({
      profile,
      href,
      reference,
      date,
      isPerLocked: move._isPerLocked,
      canEditPer: move._canEditPer,
      assessmentType,
    })

    let tags

    if (showTags) {
      const importantEventsTagList = moveToImportantEventsTagListComponent(move)
      tags = personCardComponent.tags || []
      tags.push({ items: importantEventsTagList })
    }

    const caption = profile
      ? undefined
      : { text: i18n.t('moves::move_reference', { reference }) }

    return {
      ...personCardComponent,
      isLockout: move.is_lockout,
      status: statusBadge,
      classes: isCompact
        ? `app-card--compact ${personCardComponent.classes || ''}`
        : personCardComponent.classes || '',
      caption,
      ...(tags ? { tags } : undefined),
    }
  }
}

module.exports = moveToCardComponent
