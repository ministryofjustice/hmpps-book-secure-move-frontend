const fs = require('fs')
const path = require('path')

const { flatten, kebabCase, keyBy, set } = require('lodash')

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
  default: 'govukInput',
}

function buildCommentField(
  dependentField,
  dependentValue,
  followupComment = {}
) {
  const field = {
    rows: 4,
    name: `${dependentField}--${kebabCase(dependentValue)}`,
    id: `${dependentField}--${kebabCase(dependentValue)}`,
    component: 'govukTextarea',
    classes: 'govuk-input--width-20',
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

  return field
}

function importFiles(folderPath) {
  try {
    return fs.readdirSync(folderPath).map(filename => {
      const filepath = path.resolve(folderPath, filename)
      const contents = fs.readFileSync(filepath, { encoding: 'utf8' })

      return JSON.parse(contents)
    })
  } catch (e) {
    const error = new Error('This version of the framework is not supported')
    error.code = 'MISSING_FRAMEWORK'

    throw error
  }
}

const frameworksService = {
  transformQuestion(
    key,
    { question, hint, options, validations = [], type, description } = {}
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

    if (type === 'checkbox') {
      field.multiple = true
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
    const sectionsFolder = path.resolve(
      frameworks.output,
      version,
      'frameworks',
      framework,
      'manifests'
    )
    const questionsFolder = path.resolve(
      frameworks.output,
      version,
      'frameworks',
      framework,
      'questions'
    )
    const sections = importFiles(sectionsFolder)
    const questions = importFiles(questionsFolder)

    return {
      sections: keyBy(sections, 'key'),
      questions: keyBy(questions, 'name'),
    }
  },

  getPersonEscortRecord(version) {
    return frameworksService.getFramework({
      framework: 'person-escort-record',
      version,
    })
  },
}

module.exports = frameworksService
