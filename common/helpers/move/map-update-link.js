const i18n = require('../../../config/i18n').default

const mapUpdateLink = (href, category) => {
  const categoryText = i18n.t(`moves::update_link.categories.${category}`)

  if (!categoryText) {
    return undefined
  }

  return {
    category,
    attributes: {
      'data-update-link': category,
    },
    href,
    html: i18n.t('moves::update_link.link_text', {
      context: 'with_category',
      category: categoryText,
    }),
  }
}

module.exports = mapUpdateLink
