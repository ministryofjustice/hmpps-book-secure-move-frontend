import { format } from 'date-fns'
import faker from 'faker'
import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import Page from './page'

class AllocationDetailsPage extends Page {
  constructor() {
    super()
    this.url = '/allocation/new/allocation-details'
    this.fields = {
      movesCount: Selector('#moves_count'),
      fromLocation: Selector('#from_location'),
      toLocation: Selector('#to_location'),
      date: Selector('#date'),
    }
    this.errorLinks = [
      '#moves_count',
      '#to_location',
      '#from_location',
      '#date',
    ]
  }

  fill() {
    const fieldsToFill = {
      movesCount: {
        selector: this.fields.movesCount,
        value: faker.random.number({ min: 1, max: 10 }).toString(),
      },
      fromLocation: {
        selector: this.fields.fromLocation,
        type: 'autocomplete',
      },
      toLocation: {
        selector: this.fields.toLocation,
        type: 'autocomplete',
      },
      date: {
        selector: this.fields.date,
        value: format(faker.date.future(), 'yyyy-MM-dd'),
      },
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationDetailsPage
