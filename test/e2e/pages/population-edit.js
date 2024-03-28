import faker from 'faker'
import { Selector } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class PopulationEditPage extends Page {
  constructor() {
    super()

    this.nodes = {
      submitButton: Selector('.govuk-button'),
    }

    this.fields = {
      operationalCapacity: Selector('input[name="operational_capacity"]'),
      usableCapacity: Selector('input[name="usable_capacity"]'),
      unlock: Selector('input[name="unlock"]'),
      bedwatch: Selector('input[name="bedwatch"]'),
      overnightsIn: Selector('input[name="overnights_in"]'),
      overnightsOut: Selector('input[name="overnights_out"]'),
      outOfAreaCourts: Selector('input[name="out_of_area_courts"]'),
      discharges: Selector('input[name="discharges"]'),
    }
  }

  fill() {
    const operationalCapacityValue = faker.datatype.number({
      min: 950,
      max: 1000,
    })

    const fields = {
      operationalCapacity: {
        selector: this.fields.operationalCapacity,
        value: operationalCapacityValue.toString(),
      },
      usableCapacity: {
        selector: this.fields.usableCapacity,
        value: (
          operationalCapacityValue - faker.datatype.number({ max: 10 })
        ).toString(),
      },
      unlock: {
        selector: this.fields.unlock,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
      bedwatch: {
        selector: this.fields.bedwatch,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
      overnightsIn: {
        selector: this.fields.overnightsIn,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
      overnightsOut: {
        selector: this.fields.overnightsOut,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
      outOfAreaCourts: {
        selector: this.fields.outOfAreaCourts,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
      discharges: {
        selector: this.fields.discharges,
        value: faker.datatype.number({ max: 10 }).toString(),
      },
    }

    return fillInForm(fields)
  }
}

export default PopulationEditPage
