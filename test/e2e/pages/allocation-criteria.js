import faker from 'faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import Page from './page'

class AllocationCriteriaPage extends Page {
  constructor() {
    super()
    this.url = '/allocation/new/allocation-criteria'
    this.fields = {
      prisonerCategory: Selector('#prisoner_category'),
      sentenceLength: Selector('[name="sentence_length"]'),
      complexCases: Selector('#complex_cases'),
      completeInFull: Selector('#complete_in_full'),
      hasOtherCriteria: Selector('#has_other_criteria'),
      otherCriteria: Selector('#other_criteria'),
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
    const fieldsToFill = {
      prisonerCategory: {
        selector: this.fields.prisonerCategory,
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
        value: hasOtherCriteriaAnswer,
      },
    }

    if (hasOtherCriteriaAnswer === 'Yes') {
      fieldsToFill.otherCriteria = {
        selector: this.fields.otherCriteria,
        value: faker.lorem.sentence(6),
      }
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationCriteriaPage
