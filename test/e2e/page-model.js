import dotenv from 'dotenv'
import { Selector, t } from 'testcafe'

dotenv.config()

export default class Page {
  constructor() {
    this.location = {
      home: process.env.E2E_BASE_URL || `http://${process.env.SERVER_HOST}`,
    }
  }

  get productName() {
    return Selector('.app-header__product-name').innerText
  }

  async logIn() {
    await t
      .typeText('#username', process.env.E2E_USERNAME)
      .typeText('#password', process.env.E2E_PASSWORD)
      .pressKey('enter')
  }
}
