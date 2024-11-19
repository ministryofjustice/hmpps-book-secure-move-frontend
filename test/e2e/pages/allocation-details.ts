import { format, startOfTomorrow } from 'date-fns'
import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class AllocationDetailsPage extends Page {
  url: string
  fields: { movesCount: Selector; fromLocation: Selector; toLocation: Selector; date: Selector }
  errorList: any[]
  errorForDestination: any[]

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
      '#to_location',
    ].map(error =>
      (this.nodes.errorSummary as Selector).find('a').withAttribute('href', error)
    )
    this.errorForDestination = ['#to_location'].map(error =>
      (this.nodes.errorSummary as Selector).find('a').withAttribute('href', error)
    )
  }

  async fill() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/new\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/allocation-details$/
      )

    const locationValue = await (this.nodes.locationValue as Selector).innerText

    const fieldsToFill = {
      movesCount: {
        selector: this.fields.movesCount,
        value: faker.number.int({ min: 2, max: 10 }).toString(),
      },
      fromLocation: {
        value: locationValue,
        selector: this.fields.fromLocation,
        type: 'ddl',
      },
      toLocation: {
        value: {
          type: 'random',
          except: locationValue,
        },
        selector: this.fields.toLocation,
        type: 'ddl',
      },
      date: {
        selector: this.fields.date,
        value: format(faker.date.future({  years: 1, refDate: startOfTomorrow() }), 'yyyy-MM-dd'),
      },
    }

    return fillInForm(fieldsToFill)
  }

  async fillSameLocationAndDestination() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/new\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/allocation-details$/
      )

    const locationValue = await (this.nodes.locationValue as Selector).innerText

    const fieldsToFill = {
      movesCount: {
        selector: this.fields.movesCount,
        value: faker.number.int({ min: 2, max: 10 }).toString(),
      },
      fromLocation: {
        value: locationValue,
        selector: this.fields.fromLocation,
        type: 'ddl',
      },
      toLocation: {
        value: locationValue,
        selector: this.fields.toLocation,
        type: 'ddl',
      },
      date: {
        selector: this.fields.date,
        value: format(faker.date.future({ years: 1, refDate: startOfTomorrow() }), 'yyyy-MM-dd'),
      },
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationDetailsPage
