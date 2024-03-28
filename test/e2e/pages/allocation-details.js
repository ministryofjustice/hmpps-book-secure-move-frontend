import { format, startOfTomorrow } from 'date-fns'
import faker from 'faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

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
    this.errorList = [
      '#moves_count',
      '#to_location',
      '#from_location',
      '#date',
    ].map(error =>
      this.nodes.errorSummary.find('a').withAttribute('href', error)
    )
  }

  async fill() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/new\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/allocation-details$/
      )

    const locationValue = await this.nodes.locationValue.innerText

    const fieldsToFill = {
      movesCount: {
        selector: this.fields.movesCount,
        value: faker.datatype.number({ min: 2, max: 10 }).toString(),
      },
      fromLocation: {
        value: locationValue,
        selector: this.fields.fromLocation,
        type: 'autocomplete',
      },
      toLocation: {
        value: {
          type: 'random',
          except: locationValue,
        },
        selector: this.fields.toLocation,
        type: 'autocomplete',
      },
      date: {
        selector: this.fields.date,
        value: format(faker.date.future(1, startOfTomorrow()), 'yyyy-MM-dd'),
      },
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationDetailsPage
