import faker from 'faker'
import { Selector } from 'testcafe'

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
      errorSummary: Selector('.govuk-error-summary'),
    }
    this.errorSummary = Selector('.govuk-error-summary ul')
    this.errorLinks = [
      '#prisoner_category',
      '#sentence_length',
      '#complete_in_full',
      '#has_other_criteria',
    ]
  }

  fill() {
    const fieldsToFill = [
      {
        selector: this.fields.prisonerCategory,
        value: 'C',
        type: 'radio',
      },
      {
        selector: this.fields.sentenceLength,
        type: 'radio',
      },
      {
        selector: this.fields.complexCases,
        type: 'checkbox',
      },
      {
        selector: this.fields.completeInFull,
        type: 'radio',
      },
      {
        selector: this.fields.hasOtherCriteria,
        type: 'radio',
        value: 'Yes',
      },
      {
        selector: this.fields.otherCriteria,
        value: faker.lorem.sentence(6),
      },
    ]
    return fillInForm(fieldsToFill)
  }
}
export default AllocationCriteriaPage
