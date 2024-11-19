import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class AllocationCriteriaPage extends Page {
  url: string
  fields: {
    estate: Selector
    sentenceLength: Selector
    complexCases: Selector
    completeInFull: Selector
    hasOtherCriteria: Selector
    otherCriteria: Selector
    prisonerCategoryAdultFemale: Selector
    prisonerCategoryAdultMale: Selector
    prisonerCategoryYoungOffenderFemale: Selector
    prisonerCategoryYoungOffenderMale: Selector
    otherEstate: Selector
    sentenceComment: Selector
  }
  errorList: any[]

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
      prisonerCategoryYoungOffenderFemale: Selector(
        '#prisoner_young_offender_female'
      ),
      prisonerCategoryYoungOffenderMale: Selector(
        '#prisoner_young_offender_male'
      ),
      otherEstate: Selector('#estate_comment'),
      sentenceComment: Selector('#sentence_length_comment'),
    }
    this.errorList = [
      '#estate',
      '#sentence_length',
      '#complete_in_full',
      '#has_other_criteria',
    ].map(error =>
      (this.nodes.errorSummary as Selector).find('a').withAttribute('href', error)
    )
  }

  async fill() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/new\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/allocation-criteria$/
      )

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
        value: Array(faker.number.int(4))
          .fill(undefined)
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
    const conditionalFieldsToFill: any = {}

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

    const fields = this.fields
    const conditionalEstateTypeFields = [
      {
        prefix: 'Adult male',
        selector: fields.prisonerCategoryAdultMale,
        type: 'radio',
      },
      {
        prefix: 'Adult female',
        selector: fields.prisonerCategoryAdultFemale,
        type: 'radio',
      },
      {
        prefix: 'Youth offender male',
        selector: fields.prisonerCategoryYoungOffenderMale,
        type: 'radio',
      },
      {
        prefix: 'Youth offender female',
        selector: fields.prisonerCategoryYoungOffenderFemale,
        type: 'radio',
      },
      {
        prefix: 'Other',
        selector: fields.otherEstate,
        value: faker.lorem.sentence(6),
        property: 'otherEstate',
      },
    ]

    const conditionalEstateType = conditionalEstateTypeFields.find(it =>
      formAnswers.estate.startsWith(it.prefix)
    )

    if (conditionalEstateType) {
      const { prefix: omit, ...rest } = conditionalEstateType
      const property = rest.property || 'prisonerCategory'
      conditionalFieldsToFill[property] = rest
    }

    const formConditionalAnswers = await fillInForm(conditionalFieldsToFill)
    return { ...formAnswers, ...formConditionalAnswers }
  }
}
export default AllocationCriteriaPage
