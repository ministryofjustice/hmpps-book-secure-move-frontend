import { format, startOfTomorrow } from 'date-fns'
import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class AllocationDetailsEditPage extends Page {
  fields: { date: Selector }
  errorList: any[]

  constructor() {
    super()
    this.fields = {
      date: Selector('#date'),
    }
    this.errorList = [
      (this.nodes.errorSummary as Selector).find('a').withAttribute('href', '#date'),
    ]
  }

  async fill() {
    await t
      .expect(this.getCurrentUrl())
      .match(
        /\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/edit\/allocation-details$/
      )

    const fieldsToFill = {
      date: {
        selector: this.fields.date,
        value: format(faker.date.future({ years: 1, refDate: startOfTomorrow() }), 'yyyy-MM-dd'),
      },
    }

    return fillInForm(fieldsToFill)
  }
}
export default AllocationDetailsEditPage
