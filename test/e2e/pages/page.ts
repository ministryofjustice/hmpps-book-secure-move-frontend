import { isUndefined } from 'lodash'
import { ClientFunction, Selector, t } from 'testcafe'

import { E2E } from '../../../config'

export class Page {
  baseUrl = E2E.BASE_URL
  uuidRegex = /\w{8}(?:-\w{4}){3}-\w{12}/
  nodes: { [key: string]: Selector | string | ((...args: any[]) => Selector) } =
    {
      locationMeta: Selector('meta').withAttribute('name', 'location'),
      appHeaderOrganisation: Selector('.app-header__logotype').withExactText(
        'HMPPS'
      ),
      appHeaderProduct: Selector('.app-header__product-name').withExactText(
        'Book a secure move'
      ),
      signInHeader: Selector('.govuk-header__logo').withExactText(
        'HMPPS Digital Services'
      ),
      errorSummary: Selector('.govuk-error-summary__list'),
      pageHeading: Selector('.govuk-heading-xl'),
      username: Selector('#navigation li:nth-child(1)'),
      signOutLink: Selector('#navigation li a').withExactText('Sign out'),
      submitButton: Selector('button[type="submit"]'),
      bannerHeading: Selector('.app-message__heading'),
      bannerContent: Selector('.app-message__content'),
      instructionBanner: Selector('.app-message'),
      locationsList: Selector(
        'ul[data-location-type="locations"] li a'
      ).withAttribute('href', /\/locations\/.+/),
      regionsList: Selector(
        'ul[data-location-type="regions"] li a'
      ).withAttribute('href', /\/locations\/.+/),
      locationValue: Selector('.moj-organisation-nav__title'),
      dateSelectInput: '[name="date_select"]',
    }

  getCurrentUrl = ClientFunction(() => window.location.href)

  /**
   * Submit a form
   *
   * @returns {Promise}
   */
  submitForm(): Promise<any> {
    return t.doubleClick(this.nodes.submitButton as Selector)
  }

  /**
   * Select a location, choosing randomly if no position is provided
   *
   * @param {Number} position Unbounded index of location to choose
   * @returns {Promise}
   */
  async chooseLocation({ position }: { position?: number } = {}): Promise<any> {
    await t
      .expect(this.getCurrentUrl())
      .contains('/locations')
      .expect((this.nodes.locationsList as Selector).count)
      .notEql(0, { timeout: 15000 })

    if (isUndefined(position)) {
      const count = await (this.nodes.locationsList as Selector).count
      position = Math.floor(Math.random() * count)
    }

    await t.click((this.nodes.locationsList as Selector).nth(position))

    await t.expect(this.getCurrentUrl()).notContains('/locations')
  }

  /**
   * Randomly select a region
   *
   * @returns {Promise}
   */
  async chooseRegion(): Promise<any> {
    await t
      .expect(this.getCurrentUrl())
      .contains('/locations')
      .expect((this.nodes.regionsList as Selector).count)
      .notEql(0, { timeout: 15000 })

    const count = await (this.nodes.regionsList as Selector).count
    const randomItem = Math.floor(Math.random() * count)

    await t.click((this.nodes.regionsList as Selector).nth(randomItem))

    await t.expect(this.getCurrentUrl()).notContains('/locations')
  }

  /**
   * Sign in using the auth service
   *
   * @returns {Promise}
   */
  signIn(role: { username: string; password: string }): Promise<any> {
    return t
      .expect(this.getCurrentUrl())
      .contains('/auth/')
      .typeText('#username', role.username)
      .typeText('#password', role.password)
      .click(Selector('#submit'))
      .expect(this.getCurrentUrl())
      .notContains('/auth/')
  }

  /**
   * Get definition list item value by key text
   *
   * @param {Selector} dl - definition list selector
   * @param {string} key - definition list item key text
   * @returns {Promise<string>} - definition list item description text
   */
  getDlDefinitionByKey(dl: Selector, key: string): Promise<string> {
    return dl.find('dt').withText(key).sibling('dd').innerText
  }

  async checkSummaryList(
    selector: Selector,
    labelMap: { [key: string]: RegExp | string }
  ) {
    for (const [key, value] of Object.entries(labelMap)) {
      if (value) {
        if (value instanceof RegExp) {
          await t.expect(this.getDlDefinitionByKey(selector, key)).match(value)
        } else {
          await t.expect(this.getDlDefinitionByKey(selector, key)).eql(value)
        }
      }
    }
  }

  checkBanner({ heading, content }: { heading: string; content: string }) {
    return t
      .expect((this.nodes.bannerHeading as Selector).innerText)
      .contains(heading, 'Banner contains text')
      .expect((this.nodes.bannerContent as Selector).innerText)
      .contains(content, 'Banner content contains text')
  }

  async checkErrorSummary({ errorList }: { errorList: Selector[] }) {
    for (const error of errorList) {
      await t.expect(error.exists).ok()
    }
  }
}
