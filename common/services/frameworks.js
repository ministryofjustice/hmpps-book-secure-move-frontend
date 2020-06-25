const { keyBy, set } = require('lodash')

const labelPathMap = {
  radio: 'fieldset.legend',
  checkbox: 'fieldset.legend',
  default: 'label',
}
const uiComponentMap = {
  radio: 'govukRadios',
  checkbox: 'govukCheckboxes',
  textarea: 'govukTextarea',
  default: 'govukInput',
}

function transformQuestion(
  key,
  { question, hint, options, validations = [], type }
) {
  const labelPath = labelPathMap[type] || labelPathMap.default
  const component = uiComponentMap[type] || uiComponentMap.default
  const field = {
    question,
    component,
    id: key,
    name: key,
    validate: validations.map(validation => validation.name),
  }

  set(field, labelPath, {
    text: question,
    classes: 'govuk-label--s',
  })

  if (hint) {
    set(field, 'hint.text', hint)
  }

  if (options) {
    field.items = options.map(({ value, label, followup }) => {
      return {
        value,
        text: label,
        conditional: followup,
      }
    })
  }

  return field
}

function transformManifest(key, manifest) {
  if (!manifest) {
    return {}
  }

  const steps = (manifest.steps || []).map(
    ({ questions = [], slug, name: pageTitle, next_step: nextStep }, index) => {
      let next = manifest.steps[index + 1]?.slug

      if (nextStep) {
        const transformedKeys = JSON.stringify(nextStep)
          .replace(/"question":/gi, '"field":')
          .replace(/"next_step":/gi, '"next":')

        next = JSON.parse(transformedKeys)
      }

      return {
        slug,
        next,
        pageTitle,
        key: `/${slug}`,
        fields: questions,
        pageCaption: manifest.name,
      }
    }
  )

  return {
    key,
    name: manifest.name,
    steps: keyBy(steps, 'key'),
  }
}

module.exports = {
  transformManifest,
  transformQuestion,
}
