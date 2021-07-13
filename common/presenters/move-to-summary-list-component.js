const { isNil } = require('lodash')

const moveAgreedField = require('../../app/move/app/new/fields/move-agreed')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const getUpdateLinks = require('../helpers/move/get-update-links')

function moveToSummaryListComponent(
  {
    date,
    date_from: dateFrom,
    date_to: dateTo,
    id,
    time_due: timeDue,
    move_type: moveType,
    from_location: fromLocation,
    to_location: toLocation,
    additional_information: additionalInfo,
    prison_transfer_reason: prisonTransferReason,
    move_agreed: moveAgreed,
    move_agreed_by: moveAgreedBy,
  } = {},
  { short = false, includeChangeLinks = false, updateSteps } = {}
) {
  const pickup = fromLocation?.title
  const destination = toLocation?.title || 'Unknown'
  const useLabel = ['prison_recall', 'video_remand']
  const destinationLabel = useLabel.includes(moveType)
    ? i18n.t(`fields::move_type.items.${moveType}.label`)
    : destination

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

  const updateLinks = getUpdateLinks({ id }, undefined, updateSteps)

  const rows = [
    {
      key: {
        text: i18n.t('fields::from_location.label'),
      },
      value: {
        text: pickup,
      },
    },
    {
      key: {
        text: i18n.t('fields::to_location.label'),
      },
      value: {
        text: pickup ? destinationLabel : undefined,
      },
      updateJourneyKey: 'move',
    },
    {
      key: {
        text: i18n.t('fields::date_custom.label'),
      },
      value: {
        text: filters.formatDateWithDay(date),
      },
      updateJourneyKey: 'date',
    },
    {
      key: {
        text: i18n.t('fields::date_from.label'),
      },
      value: {
        text: dateFrom
          ? filters.formatDateWithRelativeDay(dateFrom)
          : undefined,
      },
    },
    {
      key: {
        text: i18n.t('fields::date_to.label'),
      },
      value: {
        classes: dateTo ? '' : 'app-secondary-text-colour',
        text: dateFrom
          ? filters.formatDateWithRelativeDay(dateTo) || i18n.t('not_provided')
          : undefined,
      },
    },
    {
      key: {
        text: i18n.t('fields::time_due.label', {
          context: moveType,
        }),
      },
      value: {
        text: filters.formatTime(timeDue),
      },
      updateJourneyKey: moveType === 'hospital' ? 'hospital' : undefined,
    },
    {
      key: {
        text: i18n.t('fields::additional_information.display.label', {
          context: moveType,
        }),
      },
      value: {
        html: ['hospital'].includes(moveType) ? additionalInfo : undefined,
      },
      updateJourneyKey: moveType === 'hospital' ? 'hospital' : undefined,
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
  ]
    .filter(row => row.value.text || row.value.html)
    .map(row => {
      if (!includeChangeLinks) {
        return row
      }

      const updateLink = updateLinks[row.updateJourneyKey]

      if (!updateLink) {
        return row
      }

      return {
        ...row,
        actions: {
          items: [updateLink],
        },
      }
    })

  return {
    classes: 'govuk-!-font-size-16',
    rows,
  }
}

module.exports = moveToSummaryListComponent
