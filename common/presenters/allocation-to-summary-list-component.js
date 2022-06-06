const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

function allocationToSummaryListComponent(allocation) {
  const {
    prisoner_category: prisonerCategory,
    complex_cases: complexCases,
    other_criteria: otherCriteria,
    sentence_length: sentenceLength,
    sentence_length_comment: sentenceLengthComment,
    estate,
    estate_comment: estateComment,
  } = allocation
  return {
    rows: [
      {
        key: {
          text: i18n.t('fields::estate.label'),
        },
        value: {
          text: i18n.t([`fields::estate.items.${estate}`, estateComment ?? '']),
        },
      },
      {
        key: {
          text: i18n.t('fields::prisoner_common_category.label'),
        },
        value: {
          text: i18n.t([
            `fields::prisoner_adult_male.items.${prisonerCategory}`,
            `fields::prisoner_common_category.items.${prisonerCategory}`,
            'fields::prisoner_common_category.items.na',
          ]),
        },
      },
      {
        key: {
          text: i18n.t('fields::sentence_length.label'),
        },
        value: {
          text:
            sentenceLengthComment ||
            i18n.t('fields::sentence_length.items.length', {
              context: sentenceLength,
            }),
        },
      },
      {
        key: {
          text: i18n.t('fields::complex_cases.label', { context: 'with_data' }),
        },
        value: {
          /* eslint-disable indent */
          text: complexCases.length
            ? filters.oxfordJoin(
                complexCases
                  .filter(complexCase => complexCase.answer)
                  .map(complexCase => complexCase.title)
              )
            : i18n.t('none_provided'),
          /* eslint-enable indent */
        },
      },
      {
        key: {
          text: i18n.t('fields::other_criteria.label', {
            context: 'with_data',
          }),
        },
        value: {
          text: otherCriteria || i18n.t('none_provided'),
        },
      },
    ],
  }
}

module.exports = allocationToSummaryListComponent
