const personToCardComponent = require('./person-to-card-component')
const i18n = require('../../config/i18n')

function moveToCardComponent({ showMeta = true, showTags = true } = {}) {
  return function item({ id, reference, person = {}, status }) {
    const href = `/move/${id}`
    const personCardComponent = personToCardComponent({ showMeta, showTags })({
      ...person,
      href,
    })

    return {
      ...personCardComponent,
      status: {
        text: i18n.t(`statuses::${status}`),
      },
      caption: {
        text: i18n.t('moves::move_reference', {
          reference,
        }),
      },
    }
  }
}

module.exports = moveToCardComponent
