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
      // TODO it would be better to let the value blank here, so a random one would be used.
      // However, it currently makes the test fail when the chosen option is not in the visible
      // portion of the list. This clearly needs to be addressed.
      {
        selector: this.nodes.fromLocation,
        type: 'autocomplete',
        value: 0,
      },
      {
        selector: this.nodes.toLocation,
        type: 'autocomplete',
        value: 1,
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
