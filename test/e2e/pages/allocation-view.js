import { Selector, t } from 'testcafe'

import {
  formatDateWithRelativeDay,
  oxfordJoin,
} from '../../../config/nunjucks/filters'

import Page from './page'

class AllocationViewPage extends Page {
  constructor() {
    super()
    this.nodes = {
      heading: Selector('h1.govuk-heading-l'),
      completeInFullWarning: Selector('.govuk-warning-text').withText(
        'This allocation should be filled in full'
      ),
      criteriaDetails: Selector('#main-content h2')
        .withText('Criteria for allocation')
        .sibling('dl'),
      summaryPanel: Selector('#main-content h3')
        .withText('Allocation details')
        .sibling('dl'),
      allocatedMoves: Selector('.app-card'),
      allocatedMovesReferences: Selector('.app-card__caption'),
      allocatedMovesRemoveLinks: Selector('a').withText(
        'Remove from allocation'
      ),
      confirmationLink: count => Selector('a').withExactText(`${count} people`),
    }
  }

  async checkCriteria({
    prisonerCategory,
    sentenceLength,
    complexCases,
    completeInFull,
    hasOtherCriteria,
    otherCriterias,
    sentenceComment,
    estate,
    otherEstate,
  } = {}) {
    if (completeInFull === 'Yes') {
      await t.expect(this.nodes.completeInFullWarning.exists).ok()
    } else {
      await t.expect(this.nodes.completeInFullWarning.exists).notOk()
    }

    return this.checkSummaryList(this.nodes.criteriaDetails, {
      Estate: otherEstate || estate,
      'Prisoner category': prisonerCategory || 'Not applicable',
      'Time left to serve': sentenceComment || sentenceLength,
      'Complex cases for prisons to agree': oxfordJoin(complexCases),
      'Other criteria':
        hasOtherCriteria === 'Yes' ? otherCriterias : 'None provided',
    })
  }

  checkSummary({ movesCount, fromLocation, toLocation, date } = {}) {
    return this.checkSummaryList(this.nodes.summaryPanel, {
      'Number of prisoners': movesCount,
      From: new RegExp(
        fromLocation.replace(/([)(])/g, '\\$1') + '\\nRequested by',
        'g'
      ),
      To: toLocation,
      Date: formatDateWithRelativeDay(date),
    })
  }
}

export default AllocationViewPage
