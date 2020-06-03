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
        attributes: {
          'data-update-link': category,
        },
        category,
        href: urls[category],
        html: i18n.t('moves::update_link.link_text', {
          category: categoryText,
          context: 'with_category',
        }),
      }
    }
  })
  return updateLinks
}

module.exports = getUpdateLinks
