const { get, isNil } = require('lodash')

const moveAgreedField = require('../../app/move/app/new/fields/move-agreed')
const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const mapUpdateLink = require('../helpers/move/map-update-link')

/**
 * Convert a move into the structure required to render
 * as a `appMetaList` component
 *
 * @param {Object} move - the move to format
 *
 * @param {Object} [options] - config options for the presenter
 * @param {Object} [options.updateUrls={}] - object containing URLs for each edit step
 * @param {boolean} [options.showPerson=true] - Whether to include the person in the list of items
 *
 * @returns {Object} - a move formatted as a `appMetaList` component
 */
function moveToMetaListComponent(
  move,
  { updateUrls = {}, showPerson = true } = {}
) {
  const {
    _vehicleRegistration,
    date,
    date_from: dateFrom,
    date_to: dateTo,
    move_type: moveType,
    from_location: fromLocation,
    to_location: toLocation,
    additional_information: additionalInfo,
    prison_transfer_reason: prisonTransferReason,
    move_agreed: moveAgreed,
    move_agreed_by: moveAgreedBy,
    profile,
    reference,
    status,
  } = move || {}
  const destination = get(toLocation, 'title', 'Unknown')
  const useLabel = ['prison_recall', 'video_remand']
  const hasAdditionalInfo = useLabel
  const destinationLabel = useLabel.includes(moveType)
    ? i18n.t(`fields::move_type.items.${moveType}.label`)
    : destination
  const destinationSuffix =
    additionalInfo && hasAdditionalInfo.includes(moveType)
      ? ` — ${additionalInfo}`
      : ''
  const prisonTransferReasonTitle = prisonTransferReason
    ? prisonTransferReason.title
    : ''
  const showPrisonTransferReason =
    prisonTransferReasonTitle && moveType === 'prison_transfer'
  const prisonTransferReasonSuffix = additionalInfo
    ? ` — ${additionalInfo}`
    : ''
  const agreedLabel = i18n.t('moves::detail.agreement_status.agreed', {
    context: moveAgreedBy ? 'with_name' : '',
    name: moveAgreedBy,
  })
  const notAgreedLabel = i18n.t('moves::detail.agreement_status.not_agreed')
  const agreementLabel =
    moveAgreed === true || moveAgreed === moveAgreedField.items[0].value
      ? agreedLabel
      : notAgreedLabel

  const statusBadge = componentService.getComponent('mojBadge', {
    text: i18n.t(`statuses::${status}`),
  })

  const items = [
    {
      key: {
        text: i18n.t('status'),
      },
      value: {
        html: status ? statusBadge : undefined,
      },
    },
    {
      key: {
        text: i18n.t('reference'),
      },
      value: {
        text: reference,
      },
    },
    {
      key: {
        text: i18n.t('person_noun'),
      },
      value: {
        text:
          showPerson && profile?.person ? profile.person._fullname : undefined,
      },
    },
    {
      key: {
        text: i18n.t('fields::from_location.short_label'),
      },
      value: {
        text: get(fromLocation, 'title'),
      },
    },
    {
      key: {
        text: i18n.t('fields::move_type.short_label'),
      },
      value: {
        text: moveType ? destinationLabel + destinationSuffix : undefined,
      },
      action: 'move',
    },
    {
      key: {
        text: i18n.t('fields::date_type.label'),
      },
      value: {
        text: filters.formatDateWithRelativeDay(date),
      },
      action: 'date',
    },
    {
      key: {
        text: i18n.t('fields::date_from.label'),
      },
      value: {
        text: date ? undefined : filters.formatDateWithRelativeDay(dateFrom),
      },
    },
    {
      key: {
        text: i18n.t('fields::date_to.label'),
      },
      value: {
        text: date ? undefined : filters.formatDateWithRelativeDay(dateTo),
      },
    },
    {
      key: {
        text: i18n.t('fields::prison_transfer_type.label'),
      },
      value: {
        text: showPrisonTransferReason
          ? prisonTransferReasonTitle + prisonTransferReasonSuffix
          : undefined,
      },
    },
    {
      key: {
        text: i18n.t('fields::move_agreed.label'),
      },
      value: {
        text: !isNil(moveAgreed) ? agreementLabel : undefined,
      },
    },
    {
      key: {
        text: i18n.t('collections::vehicle_registration'),
      },
      value: {
        text: _vehicleRegistration,
      },
    },
  ]
    .filter(item => item.value.text || item.value.html)
    .map(item => {
      if (!item.action) {
        return item
      }

      if (!updateUrls[item.action]) {
        delete item.action
        return item
      }

      return {
        ...item,
        action: {
          ...mapUpdateLink(updateUrls[item.action], item.action),
          classes: 'app-meta-list__action--sidebar',
        },
      }
    })

  return {
    items,
  }
}

module.exports = moveToMetaListComponent
