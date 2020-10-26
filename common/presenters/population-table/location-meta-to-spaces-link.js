const i18n = require('../../../config/i18n')

const spacesFormatter = function (count) {
  if (count === undefined) {
    return i18n.t('population::add_space')
  }

  return i18n.t('population::spaces_with_count', { count })
}

module.exports = function locationToMetaToSpacesLink({
  hrefPrefix = '',
  space,
  id,
}) {
  return `<a href="${hrefPrefix}">${spacesFormatter(space)}</a>`
}
