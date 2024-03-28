import { expect } from 'chai'
import { addDays } from 'date-fns'
import { Selector } from 'testcafe'

import { formatDateWithDay } from '../../../config/nunjucks/filters'

import { Page } from './page'

export class MoveLodgeSavedPage extends Page {
  nodes: { [key: string]: Selector }

  constructor() {
    super()

    this.nodes = {
      // @ts-ignore // TODO: remove this comment when ./page is converted to TS
      ...this.nodes,
      banner: Selector('#main-content > div > div > div > h1'),
      confirmation: Selector('#main-content > div > div > p'),
      moveLink: Selector(
        '#main-content > div > div > p > strong:nth-child(1) > a'
      ),
      location: Selector('#main-content > div > div > p > strong:nth-child(2)'),
      date: Selector('#main-content > div > div > p > strong:nth-child(3)'),
      endDate: Selector('#main-content > div > div > p > strong:nth-child(4)'),
    }
  }

  async checkLodgeSuccessMessage(
    type: 'added' | 'updated',
    startDate: Date,
    length: number,
    location: string
  ) {
    await this.nodes.banner.exists
    expect(await this.nodes.banner.textContent).contains(
      `Overnight lodge ${type}`
    )
    await this.nodes.confirmation.exists

    expect(await this.nodes.date.innerText).eql(formatDateWithDay(startDate))

    if (length > 1) {
      expect(await this.nodes.endDate.innerText).eql(
        formatDateWithDay(addDays(startDate, length))
      )
    }

    expect(await this.nodes.location.innerText).eql(location)
  }

  async checkAddLodgeSuccessMessage(
    startDate: Date,
    length: number,
    location: string
  ) {
    await this.checkLodgeSuccessMessage('added', startDate, length, location)
  }

  async checkUpdateLodgeSuccessMessage(
    startDate: Date,
    length: number,
    location: string
  ) {
    await this.checkLodgeSuccessMessage('updated', startDate, length, location)
  }
}
