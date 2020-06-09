import { endOfWeek, format } from 'date-fns'
import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import Page from './page'

class AllocationDetailsPage extends Page {
  constructor() {
    super()
    this.url = '/allocation/new/allocation-details'
    this.nodes = {
      movesCount: Selector('#moves_count'),
      fromLocation: Selector('#from_location'),
      toLocation: Selector('#to_location'),
      date: Selector('#date'),
    }
    this.errorSummary = Selector('.govuk-error-summary__list')
    this.errorLinks = [
      '#moves_count',
      '#to_location',
      '#from_location',
      '#date',
    ]
  }

  fill() {
    const fieldsToFill = [
      {
        selector: this.nodes.movesCount,
        value: '3',
      },
      {
        selector: this.nodes.fromLocation,
        type: 'autocomplete',
      },
      {
        selector: this.nodes.toLocation,
        type: 'autocomplete',
      },
      {
        selector: this.nodes.date,
        value: format(endOfWeek(new Date()), 'dd/MM/yyyy'),
      },
    ]
    return fillInForm(fieldsToFill)
  }
}
export default AllocationDetailsPage
