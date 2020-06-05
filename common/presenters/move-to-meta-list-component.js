const { get, isNil } = require('lodash')

const moveAgreedField = require('../../app/move/fields/move-agreed')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function moveToMetaListComponent(
  {
    date,
    date_from: dateFrom,
    date_to: dateTo,
    time_due: timeDue,
    move_type: moveType,
    from_location: fromLocation,
    to_location: toLocation,
    additional_information: additionalInfo,
    prison_transfer_reason: prisonTransferReason = {},
    move_agreed: moveAgreed,
    move_agreed_by: moveAgreedBy,
  } = {},
  actions = {}
) {
  const destination = get(toLocation, 'title', 'Unknown')
  const destinationLabel =
    moveType === 'prison_recall'
      ? i18n.t('fields::move_type.items.prison_recall.label')
      : destination
  const destinationSuffix =
    additionalInfo && moveType === 'prison_recall' ? ` — ${additionalInfo}` : ''
  const showPrisonTransferReason =
    prisonTransferReason.title && moveType === 'prison_transfer'
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

  Object.keys(actions).forEach(key => {
    actions[key] = {
      classes: 'app-meta-list__action--sidebar',
      ...actions[key],
    }
  })
  const items = [
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
        text: destinationLabel + destinationSuffix,
      },
      action: actions.move,
    },
    {
      key: {
        text: i18n.t('fields::date_type.label'),
      },
      value: {
        text: filters.formatDateWithRelativeDay(date),
      },
      action: actions.date,
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
        text: i18n.t('fields::time_due.label'),
      },
      value: {
        text: filters.formatTime(timeDue),
      },
    },
    {
      key: {
        text: i18n.t('fields::prison_transfer_type.label'),
      },
      value: {
        text: showPrisonTransferReason
          ? prisonTransferReason.title + prisonTransferReasonSuffix
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
  ]

  return {
    items,
  }
}

module.exports = moveToMetaListComponent
