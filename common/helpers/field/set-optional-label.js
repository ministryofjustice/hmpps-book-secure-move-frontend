const { cloneDeep, get, set, flatten } = require('lodash')

const i18n = require('../../../config/i18n')

function setOptionalLabel([key, field]) {
  const translated = cloneDeep(field)
  const validations = flatten([translated.validate])
  const isOptional =
    validations.filter(v => v?.type === 'required' || v === 'required').length <
    1
  const labelPaths = [
    'label.text',
    'label.html',
    'fieldset.legend.text',
    'fieldset.legend.html',
  ]

  if (isOptional) {
    labelPaths.forEach(path => {
      const key = get(translated, path)

      if (key) {
        set(translated, path, `${key} (${i18n.t('optional')})`)
      }
    })
  }

  return [key, translated]
}

module.exports = setOptionalLabel
