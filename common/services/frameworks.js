const fs = require('fs')
const path = require('path')

const debug = require('debug')('app:frameworks')
const { flatten, get, kebabCase, keyBy, set } = require('lodash')

const { FRAMEWORKS: frameworksConfig } = require('../../config')
const markdown = require('../../config/markdown')
const { frameworks } = require('../../config/paths')

const labelPathMap = {
  radio: 'fieldset.legend',
  checkbox: 'fieldset.legend',
  default: 'label',
}
const uiComponentMap = {
  radio: 'govukRadios',
  checkbox: 'govukCheckboxes',
  textarea: 'govukTextarea',
  text: 'govukInput',
  add_multiple_items: 'appAddAnother',
  default: 'govukInput',
}
const inputWidthClasses = {
  20: 'govuk-input--width-20',
  10: 'govuk-input--width-10',
  5: 'govuk-input--width-5',
  4: 'govuk-input--width-4',
  3: 'govuk-input--width-3',
  2: 'govuk-input--width-2',
}

function buildCommentField(
  dependentField,
  dependentValue,
  followupComment = {}
) {
  const component = uiComponentMap[followupComment.type] || 'govukTextarea'
  const {
    rows = 4,
    character_width: charWidth,
    prefix,
    suffix,
  } = followupComment.display || {}
  const field = {
    rows,
    component,
    dependentQuestionKey: dependentField,
    name: `${dependentField}--${kebabCase(dependentValue)}`,
    id: `${dependentField}--${kebabCase(dependentValue)}`,
    classes: inputWidthClasses[charWidth] || 'govuk-input--width-20',
    label: {
      text: followupComment.label,
      classes: 'govuk-label--s',
    },
    validate: followupComment.validations,
  }

  if (followupComment.hint) {
    field.hint = {
      html: markdown.render(followupComment.hint),
      classes: 'markdown',
    }
  }

  if (prefix) {
    field.prefix = {
      text: prefix,
    }
  }

  if (suffix) {
    field.suffix = {
      text: suffix,
    }
  }

  return field
}

function importFiles(version, ...paths) {
  const folderPath = path.resolve(
    frameworks.output,
    version,
    'frameworks',
    ...paths
  )

  try {
    return fs.readdirSync(folderPath).map(filename => {
      const filepath = path.resolve(folderPath, filename)
      const contents = fs.readFileSync(filepath, { encoding: 'utf8' })

      return JSON.parse(contents)
    })
  } catch (e) {
    const error = new Error(
      `Version ${version} of the framework is not supported`
    )
    error.code = 'UNSUPPORTED_FRAMEWORK'

    throw error
  }
}

const frameworksService = {
  cache: {},

  transformQuestion(
    key,
    {
      description,
      display = {},
      prefix,
      suffix,
      hint,
      list_item_name: itemName,
      options,
      question,
      questions,
      type,
      validations = [],
    } = {}
  ) {
    if (!key) {
      return {}
    }

    const labelPath = labelPathMap[type] || labelPathMap.default
    const component = uiComponentMap[type] || uiComponentMap.default
    const field = {
      question,
      description,
      component,
      itemName,
      rows: display.rows,
      classes: inputWidthClasses[display.character_width] || '',
      descendants: questions,
      id: key,
      name: key,
      validate: validations,
    }

    set(field, labelPath, {
      text: question,
      classes: 'govuk-label--s',
    })

    if (hint) {
      field.hint = {
        html: markdown.render(hint),
        classes: 'markdown',
      }
    }

    if (display.prefix) {
      field.prefix = {
        text: display.prefix,
      }
    }

    if (display.suffix) {
      field.suffix = {
        text: display.suffix,
      }
    }

    if (type === 'checkbox') {
      field.multiple = true
    }

    if (type === 'add_multiple_items') {
      // allow the form wizard to store the value as an array
      field.multiple = true
      // prevent the form wizard processing these fields
      field['ignore-defaults'] = true
      // use `default` to start with one empty item
      field.default = [{}]

      // default minimum items based on whether it's required
      field.minItems = validations.find(val => val.type === 'required') ? 1 : 0
    }

    if (options) {
      field.items = options.map(
        ({
          value,
          label,
          hint: itemHint,
          followup,
          followup_comment: followupComment,
        }) => {
          const commentField = buildCommentField(key, value, followupComment)
          const flattenedFollowup = flatten([followup])

          const item = {
            value,
            text: label,
            conditional: followupComment ? commentField : flattenedFollowup,
          }

          if (itemHint) {
            item.hint = {
              html: markdown.render(itemHint),
              classes: 'markdown',
            }
          }

          if (followup) {
            item.followup = flattenedFollowup
          }

          return item
        }
      )
    }

    return field
  },

  transformManifest(key, manifest) {
    if (!manifest) {
      return {}
    }

    const steps = (manifest.steps || []).map(
      (
        {
          questions = [],
          slug,
          type: stepType,
          name: pageTitle,
          next_step: nextStep,
          content_before_questions: beforeFieldsContent,
          content_after_questions: afterFieldsContent,
        },
        index
      ) => {
        let next = get(manifest, `steps[${index + 1}].slug`)

        if (nextStep) {
          const transformedKeys = JSON.stringify(nextStep)
            .replace(/"question":/gi, '"field":')
            .replace(/"next_step":/gi, '"next":')

          next = JSON.parse(transformedKeys)
        }

        return {
          slug,
          next,
          stepType,
          pageTitle,
          beforeFieldsContent,
          afterFieldsContent,
          key: `/${slug}`,
          fields: questions,
          pageCaption: manifest.name,
        }
      }
    )

    return {
      key,
      name: manifest.name,
      order: manifest.order,
      steps: keyBy(steps, 'key'),
    }
  },

  getFramework({ framework = '', version = '' } = {}) {
    if (!framework) {
      const error = new Error('You must specify a framework name')
      error.code = 'MISSING_FRAMEWORK'

      throw error
    }

    if (!version) {
      const error = new Error('You must specify a framework version')
      error.code = 'MISSING_FRAMEWORK_VERSION'

      throw error
    }

    const frameworkKey = `${framework}:v${version}`
    const sections = importFiles(version, framework, 'manifests')
    const questions = importFiles(version, framework, 'questions')

    if (frameworksService.cache[frameworkKey]) {
      debug('Loading framework (CACHED):', frameworkKey)
      return frameworksService.cache[frameworkKey]
    }

    const frameworkFromFiles = {
      sections: keyBy(sections, 'key'),
      questions: keyBy(questions, 'name'),
    }

    frameworksService.cache[frameworkKey] = frameworkFromFiles

    debug('Loading framework (UNCACHED):', frameworkKey)

    return frameworkFromFiles
  },

  getPersonEscortRecord(version = frameworksConfig.CURRENT_VERSION) {
    return frameworksService.getFramework({
      framework: 'person-escort-record',
      version,
    })
  },
}

module.exports = frameworksService
