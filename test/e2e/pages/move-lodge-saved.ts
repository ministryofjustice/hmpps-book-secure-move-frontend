import { Selector, t } from 'testcafe'
// @ts-ignore
import { fillInForm } from '../_helpers'
const { addDays } = require('date-fns')


// @ts-ignore // TODO: convert to TS
import Page from './page'
import { expect } from 'chai'
import { now } from 'lodash'

export class MoveLodgeSavedPage extends Page {
  nodes: { [key: string]: Selector }

  constructor() {
    super()

    this.nodes = {
      // @ts-ignore // TODO: remove this comment when ./page is converted to TS
      ...this.nodes,
      banner: Selector('#main-content > div > div > div > h1'),
      confirmation: Selector('#main-content > div > div > p'),
      moveLink: Selector('#main-content > div > div > p > strong:nth-child(1) > a'),
      date: Selector('#main-content > div > div > p > strong:nth-child(3)'),
    }
  }

  async checkAddLodgeSuccessMessage(overnights: number) {
    await this.nodes.banner.exists
    expect(await  this.nodes.banner.textContent).contains('Overnight lodge added')
    await this.nodes.confirmation.exists
    //confirm date of lodge (and end if applicable)
  }

}
