import { Selector } from 'testcafe'

import * as filters from '../../../config/nunjucks/filters'

import { Page } from './page'

class PersonPage extends Page {
  constructor() {
    super()

    this.nodes = {
      ...this.nodes,
      personalDetails: Selector('#main-content h2')
        .withText('Personal details')
        .sibling('dl'),
    }
  }

  async checkPersonalDetails({
    policeNationalComputer,
    prisonNumber,
    dateOfBirth,
    gender,
    ethnicity,
  }: any = {}) {
    await this.checkSummaryList(this.nodes.personalDetails as Selector, {
      'PNC number': policeNationalComputer,
      'Prison number': prisonNumber,
      'Date of birth': (dateOfBirth
        ? `${filters.formatDate(dateOfBirth)} (Age ${filters.calculateAge(
            dateOfBirth
          )})`
        : undefined)!,
      Gender: gender,
      Ethnicity: ethnicity,
    })
  }
}

export default PersonPage
