const i18n = require('../../../config/i18n')

const getUpdateUrls = require('./get-update-urls')

const getUpdateLink = (category, urls) => {
  const categoryText = i18n.t(`moves::update_link.categories.${category}`)

  if (!categoryText) {
    return
  }

  return {
    category,
    attributes: {
      'data-update-link': category,
    },
    href: urls[category],
    html: i18n.t('moves::update_link.link_text', {
      context: 'with_category',
      category: categoryText,
    }),
  }
}

const getUpdateLinks = (move, canAccess, updateSteps = []) => {
  const urls = getUpdateUrls(move, canAccess, updateSteps)

  const updateLinks = updateSteps.reduce((acc, updateJourney) => {
    const category = updateJourney.key

    if (urls[category]) {
      const updateLink = getUpdateLink(category, urls)

      if (updateLink) {
        acc[category] = updateLink
      }
    }

    return acc
  }, {})

  return updateLinks
}

module.exports = getUpdateLinks
