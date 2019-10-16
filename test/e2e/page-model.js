import dotenv from 'dotenv'
import { Selector } from 'testcafe'

dotenv.config()

const baseUrl = process.env.E2E_BASE_URL || `http://${process.env.SERVER_HOST}`

export default class Page {
  constructor() {
    this.locations = {
      home: baseUrl,
      signout: `${baseUrl}/auth/sign-out`,
      locationsAll: `${baseUrl}/locations/all`,
    }

    this.nodes = {
      appHeader: Selector('.app-header__logo').withExactText(
        'HMPPS Book a secure move'
      ),
      signInHeader: Selector('.govuk-header__logo').withExactText(
        'HMPPS Digital Services'
      ),
      pageHeading: Selector('.govuk-heading-xl'),
      policeUserName: Selector('.app-header__navigation-item').withExactText(
        'Police User'
      ),
      supplierUserName: Selector('.app-header__navigation-item').withExactText(
        'GEOAmey Supplier'
      ),
      createMoveButton: Selector('.govuk-button').withExactText(
        'Create a move'
      ),
      downloadMovesButton: Selector('.govuk-button').withExactText(
        'Download moves'
      ),
      paginationPrev: Selector('.app-pagination__list-item--prev a'),
      paginationNext: Selector('.app-pagination__list-item--next a'),
      paginationToday: Selector('.app-pagination__list-item a').withText(
        'Today'
      ),
    }
  }
}
