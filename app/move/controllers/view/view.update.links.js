const i18n = require('../../../../config/i18n')

const getUpdateLinks = (updateSteps, urls) => {
  const updateLinks = {}
  updateSteps.forEach(updateJourney => {
    const category = updateJourney.key

    if (!urls[category]) {
      return
    }

    const categoryText = i18n.t(`moves::update_link.categories.${category}`)

    if (categoryText) {
      updateLinks[category] = {
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
  })
  return updateLinks
}

module.exports = getUpdateLinks
