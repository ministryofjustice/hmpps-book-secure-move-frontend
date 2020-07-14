import faker from 'faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import Page from './page'

class AllocationCriteriaPage extends Page {
  constructor() {
    super()
    this.url = '/allocation/new/allocation-criteria'
    this.fields = {
      estate: Selector('#estate'),
      sentenceLength: Selector('[name="sentence_length"]'),
      complexCases: Selector('#complex_cases'),
      completeInFull: Selector('#complete_in_full'),
      hasOtherCriteria: Selector('#has_other_criteria'),
      otherCriteria: Selector('#other_criteria'),
      prisonerCategoryAdultFemale: Selector('#prisoner_female_category'),
      prisonerCategoryAdultMale: Selector('#prisoner_male_category'),
      prisonerCategoryYouthFemale: Selector('#prisoner_youth_female_category'),
      prisonerCategoryYouthMale: Selector('#prisoner_youth_male_category'),
      otherEstate: Selector('#estate_comment'),
      sentenceComment: Selector('#sentence_length_comment'),
    }
    this.errorList = [
      '#prisoner_category',
      '#sentence_length',
      '#complete_in_full',
      '#has_other_criteria',
    ].map(error =>
      this.nodes.errorSummary.find('a').withAttribute('href', error)
    )
  }

  async fill() {
    await t.expect(this.getCurrentUrl()).contains(this.url)

    const hasOtherCriteriaAnswer = faker.random.arrayElement(['Yes', 'No'])
    // const estateAnswer = faker.random.arrayElement([
    //   'Adult male',
    //   'Adult female',
    //   'Juvenile male',
    //   'Juvenile female',
    //   'Youth male',
    //   'Youth female',
    //   'Other',
    // ])
    const estateAnswer = 'Adult male'
    const sentenceLength = faker.random.arrayElement([
      'Any time to serve',

      '16 months or less',

      'Over 16 months',

      'Other',
    ])
    const fieldsToFill = {
      estate: {
        selector: this.fields.estate,
        type: 'radio',
        value: estateAnswer,
      },
      sentenceLength: {
        selector: this.fields.sentenceLength,
        type: 'radio',
      },
      // As the UI pattern has all options checked by default we need to
      // uncheck the options first before we can get the checked values
      complexCasesUncheck: {
        selector: this.fields.complexCases,
        type: 'checkbox',
        value: [0, 1, 2, 3],
      },
      complexCases: {
        selector: this.fields.complexCases,
        type: 'checkbox',
        value: Array(faker.random.number(4))
          .fill()
          .map((v, i) => i),
      },
      completeInFull: {
        selector: this.fields.completeInFull,
        type: 'radio',
      },
      hasOtherCriteria: {
        selector: this.fields.hasOtherCriteria,
        type: 'radio',
        value: hasOtherCriteriaAnswer,
      },
    }

    if (hasOtherCriteriaAnswer === 'Yes') {
      fieldsToFill.otherCriteria = {
        selector: this.fields.otherCriteria,
        value: faker.lorem.sentence(6),
      }
    }

    if (sentenceLength === 'Other') {
      fieldsToFill.sentenceComment = {
        selector: this.fields.sentenceComment,
        value: faker.lorem.sentence(6),
      }
    }

    switch (estateAnswer) {
      case 'Adult male': {
        fieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryAdultMale,
          type: 'radio',
        }
        break
      }

      case 'Adult female': {
        fieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryAdultFemale,
          type: 'radio',
        }
        break
      }

      case 'Youth male': {
        fieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryYouthMale,
          type: 'radio',
        }
        break
      }

      case 'Youth female': {
        fieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryYouthFemale,
          type: 'radio',
        }
        break
      }

      case 'Other': {
        fieldsToFill.otherEstate = {
          selector: this.fields.otherEstate,
          value: faker.lorem.sentence(6),
        }
        break
      }

      case 'Juvenile male':
        break

      case 'Juvenile female':
        break

      default:
        break
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationCriteriaPage
