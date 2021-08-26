const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

/**
 * Convert a "single request" move into the structure required to
 * render as a `govukSummaryList` component
 *
 * @param {Object} move - the "single request" move to format
 *
 *
 * @returns {Object} - a move formatted as a `govukSummaryList` component
 */
function singleRequestToSummaryListComponent({
  date_from: dateFrom,
  date_to: dateTo,
  move_type: moveType,
  additional_information: additionalInfo,
  prison_transfer_reason: prisonTransferReason,
  move_agreed: moveAgreed,
  move_agreed_by: moveAgreedBy,
} = {}) {
  if (moveType !== 'prison_transfer') {
    return undefined
  }

  const agreedArgs = {
    context: moveAgreedBy ? 'with_name' : '',
    name: moveAgreedBy,
  }

  const rows = [
    {
      key: {
        text: i18n.t('fields::date_from.label'),
      },
      value: {
        text: filters.formatDateWithRelativeDay(dateFrom),
      },
    },
    {
      key: {
        text: i18n.t('fields::date_to.label'),
      },
      value: {
        text: filters.formatDateWithRelativeDay(dateTo),
      },
    },
    {
      key: {
        text: i18n.t('fields::prison_transfer_type.label'),
      },
      value: {
        text: prisonTransferReason?.title,
      },
    },
    {
      key: {
        text: i18n.t('fields::additional_information.display.label'),
      },
      value: {
        html: additionalInfo,
      },
    },
    {
      key: {
        text: i18n.t('fields::move_agreed.label'),
      },
      value: {
        text:
          moveAgreed === true
            ? i18n.t('moves::detail.agreement_status.agreed', agreedArgs)
            : i18n.t('moves::detail.agreement_status.not_agreed'),
      },
    },
  ].map(row => {
    if (!row.value.text && !row.value.html) {
      row.value.classes = 'app-secondary-text-colour'
      row.value.text = i18n.t('not_provided')
    }

    return row
  })

  return {
    classes: 'govuk-!-font-size-16',
    count: rows.length,
    heading: i18n.t('moves::detail.single_request.heading'),
    rows,
  }
}

module.exports = singleRequestToSummaryListComponent
