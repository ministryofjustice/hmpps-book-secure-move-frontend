const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function allocationToMetaListComponent(allocation) {
  const {
    prisoner_category: prisonerCategory,
    complex_cases: complexCases,
    other_criteria: otherCriteria,
    sentence_length: sentenceLength,
  } = allocation
  return {
    rows: [
      {
        key: {
          text: i18n.t('allocations::view.fields.category'),
        },
        value: {
          text: filters.startCase(prisonerCategory),
        },
      },
      {
        key: {
          text: i18n.t('allocations::view.fields.sentence_length.label'),
        },
        value: {
          text: i18n.t('fields::sentence_length.items.length', {
            context: sentenceLength,
          }),
        },
      },
      {
        key: {
          text: i18n.t('allocations::view.fields.complex_cases'),
        },
        value: {
          /* eslint-disable indent */
          text: complexCases.length
            ? filters.oxfordJoin(
                complexCases
                  .filter(complexCase => complexCase.answer)
                  .map(complexCase => complexCase.title)
              )
            : i18n.t('allocations::view.fields.none_provided'),
          /* eslint-enable indent */
        },
      },
      {
        key: {
          text: i18n.t('allocations::view.fields.other_criteria'),
        },
        value: {
          text:
            otherCriteria || i18n.t('allocations::view.fields.none_provided'),
        },
      },
    ],
  }
}

module.exports = allocationToMetaListComponent
