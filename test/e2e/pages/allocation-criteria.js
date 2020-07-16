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
      prisonerCategoryAdultFemale: Selector('#prisoner_adult_female'),
      prisonerCategoryAdultMale: Selector('#prisoner_adult_male'),
      prisonerCategoryYouthFemale: Selector('#prisoner_youth_female'),
      prisonerCategoryYouthMale: Selector('#prisoner_youth_male'),
      otherEstate: Selector('#estate_comment'),
      sentenceComment: Selector('#sentence_length_comment'),
    }
    this.errorList = [
      '#estate',
      '#sentence_length',
      '#complete_in_full',
      '#has_other_criteria',
    ].map(error =>
      this.nodes.errorSummary.find('a').withAttribute('href', error)
    )
  }

  async fill() {
    await t.expect(this.getCurrentUrl()).contains(this.url)

    const fieldsToFill = {
      estate: {
        selector: this.fields.estate,
        type: 'radio',
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
      },
    }

    const formAnswers = await fillInForm(fieldsToFill)
    const conditionalFieldsToFill = {}

    if (formAnswers.hasOtherCriteria === 'Yes') {
      conditionalFieldsToFill.otherCriteria = {
        selector: this.fields.otherCriteria,
        value: faker.lorem.sentence(6),
      }
    }

    if (formAnswers.sentenceLength === 'Other') {
      conditionalFieldsToFill.sentenceComment = {
        selector: this.fields.sentenceComment,
        value: faker.lorem.sentence(6),
      }
    }

    switch (formAnswers.estate) {
      case 'Adult male': {
        conditionalFieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryAdultMale,
          type: 'radio',
        }
        break
      }

      case 'Adult female': {
        conditionalFieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryAdultFemale,
          type: 'radio',
        }
        break
      }

      case 'Youth male': {
        conditionalFieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryYouthMale,
          type: 'radio',
        }
        break
      }

      case 'Youth female': {
        conditionalFieldsToFill.prisonerCategory = {
          selector: this.fields.prisonerCategoryYouthFemale,
          type: 'radio',
        }
        break
      }

      case 'Other': {
        conditionalFieldsToFill.otherEstate = {
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

    const formConditionalAnswers = await fillInForm(conditionalFieldsToFill)
    return { ...formAnswers, ...formConditionalAnswers }
  }
}
export default AllocationCriteriaPage
