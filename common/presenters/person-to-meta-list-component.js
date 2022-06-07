const i18n = require('../../config/i18n').default

function mapIdentifier({ key, value }) {
  return {
    key: {
      html: i18n.t(`fields::${key}.label`),
    },
    value: {
      text: value,
    },
  }
}

/**
 * Convert a person into the structure required to render
 * as a `appMetaList` component
 *
 * @param {Object} person - the person to format
 *
 * @returns {Object} - a person formatted as a `appMetaList` component
 */
module.exports = function personToMetaListComponent(person) {
  if (!person) {
    return undefined
  }

  const identifiers = ['police_national_computer', 'prison_number']
    .filter(identifier => person[identifier])
    .map(identifier => ({
      key: identifier,
      value: person[identifier],
    }))
    .map(mapIdentifier)

  const items = [
    {
      key: {
        text: i18n.t('name'),
      },
      value: {
        text: person._fullname,
      },
    },
    ...identifiers,
  ]

  return {
    classes: 'govuk-!-font-size-16',
    items,
  }
}
