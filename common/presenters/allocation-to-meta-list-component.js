const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function allocationToMetaListComponent(allocation) {
  const {
    moves,
    from_location: fromLocation,
    to_location: toLocation,
    date,
  } = allocation
  return {
    items: [
      {
        key: {
          text: i18n.t('fields::moves_count.label'),
        },
        value: { text: moves.length },
      },
      {
        key: {
          text: i18n.t('fields::from_location.short_label'),
        },
        value: { text: fromLocation.title },
      },
      {
        key: {
          text: i18n.t('fields::move_type.short_label'),
        },
        value: { text: toLocation.title },
      },
      {
        key: {
          text: i18n.t('fields::date_type.label'),
        },
        value: { text: filters.formatDateWithRelativeDay(date) },
      },
    ],
  }
}

module.exports = allocationToMetaListComponent
