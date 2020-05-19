import { ClientFunction, Selector, t } from 'testcafe'

import { E2E } from '../../../config'

export default class Page {
  constructor() {
    this.baseUrl = E2E.BASE_URL
    this.nodes = {
      locationMeta: Selector('meta').withAttribute('name', 'location'),
      appHeader: Selector('.app-header__logo').withExactText(
        'HMPPS Book a secure move'
      ),
      signInHeader: Selector('.govuk-header__logo').withExactText(
        'HMPPS Digital Services'
      ),
      pageHeading: Selector('.govuk-heading-xl'),
      username: Selector('#navigation li:nth-child(1)'),
      signOutLink: Selector('#navigation li a').withExactText('Sign out'),
      submitButton: Selector('button[type="submit"]'),
      locationsList: Selector('ul li a').withAttribute(
        'href',
        /\/locations\/.+/
      ),
    }
    this.getCurrentUrl = ClientFunction(() => window.location.href)
  }

  /**
   * Submit a form
   *
   * @returns {Promise}
   */
  submitForm() {
    return t.click(this.nodes.submitButton)
  }

  /**
   * Randomly select a location
   *
   * @returns {Promise}
   */
  async chooseLocation() {
    await t
      .expect(this.getCurrentUrl())
      .contains('/locations')
      .expect(this.nodes.locationsList.count)
      .notEql(0, { timeout: 15000 })

    const count = await this.nodes.locationsList.count
    const randomItem = Math.floor(Math.random() * count)

    await t.click(this.nodes.locationsList.nth(randomItem))

    await t.expect(this.getCurrentUrl()).notContains('/locations')
  }

  /**
   * Sign in using the auth service
   *
   * @returns {Promise}
   */
  signIn(role) {
    return t
      .expect(this.getCurrentUrl())
      .contains('/auth/login')
      .typeText('#username', role.username)
      .typeText('#password', role.password)
      .click(Selector('#submit'))
      .expect(this.getCurrentUrl())
      .notContains('/auth/login')
  }

  /**
   * Select "all locations"
   *
   * @returns {Promise}
   */
  async chooseAllLocations() {
    const allLocationsLink = Selector('a').withAttribute(
      'href',
      '/locations/all'
    )
    return t.click(allLocationsLink)
  }

  /**
   * Get definition list item value by key text
   *
   * @param {Selector} dl - definition list selector
   * @param {string} key - definition list item key text
   * @returns {Promise<string>} - definition list item description text
   */
  getDlDefinitionByKey(dl, key) {
    return dl
      .find('dt')
      .withText(key)
      .sibling('dd').innerText
  }
}
