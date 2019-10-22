import dotenv from 'dotenv'
import { Selector } from 'testcafe'
import faker from 'faker'
import {
  getInnerText,
  selectAutocompleteOption,
  selectFieldsetOption,
  fillInForm,
} from './helpers'

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
        'End-to-End Test Police'
      ),
      supplierUserName: Selector('.app-header__navigation-item').withExactText(
        'End-to-End Test Supplier'
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
      continueButton: Selector('.govuk-button').withText('Continue'),
      scheduleMoveButton: Selector('.govuk-button').withText('Schedule move'),
      cancelMoveButton: Selector('.govuk-button').withText('Cancel move'),
      downloadMovesLink: Selector('a').withText('Download moves'),
      personalDetailsSummary: Selector('.govuk-summary-list'),
      cancelLink: Selector('.app-link--destructive').withText(
        'Cancel this move'
      ),
      messageHeading: Selector('.app-message__heading'),
      details: Selector('.govuk-details'),
      custodySuitLocationLink: Selector('a').withText(
        'Guildford Custody Suite'
      ),
    }
  }

  /**
   * Fill in random personal details
   *
   * @returns {Promise<FormDetails>} - filled in personal details
   */
  async fillInPersonalDetails() {
    return fillInForm({
      text: {
        police_national_computer: faker.random.number().toString(),
        last_name: faker.name.lastName(),
        first_names: faker.name.firstName(),
        date_of_birth: faker.date
          .between('01/01/1940', '01/01/1990')
          .toLocaleDateString(),
      },
      options: {
        ethnicity: await selectAutocompleteOption('Ethnicity').then(
          getInnerText
        ),
        gender: await selectFieldsetOption(
          'Gender',
          faker.random.arrayElement(['Male', 'Female'])
        ).then(getInnerText),
      },
    })
  }

  /**
   * Fill in move details
   *
   * @param {'Court'|'Prison recall'} moveType - type of move
   * @returns {Promise<FormDetails>} - filled in move details
   */
  async fillInMoveDetails(moveType) {
    await selectFieldsetOption('Move to', moveType)

    return fillInForm({
      to_location_court_appearance:
        moveType === 'Court'
          ? await selectAutocompleteOption('Name of court').then(getInnerText)
          : moveType,
      date_type: await selectFieldsetOption('Date', 'Today').then(getInnerText),
    })
  }

  /**
   * Get reference number on confirmation page
   *
   * @returns {Promise<string>} - reference number
   */
  async getMoveConfirmationReferenceNumber() {
    const referenceText = await Selector('.govuk-panel__title')
      .withText('Move scheduled')
      .sibling('.govuk-panel__body')
      .withText('Reference number').innerText

    return referenceText.split('\n')[1]
  }

  async getMoveSummaryReferenceNumber() {
    const referenceText = await Selector('.govuk-caption-xl').withText(
      'Move reference:'
    ).innerText

    return referenceText.split(': ')[1]
  }

  /**
   * Get an item in dashboard move list by its reference number
   *
   * @param {string} referenceNumber - move reference number
   * @returns {Promise<Selector>} - item card
   */
  async getMoveListItemByReference(referenceNumber) {
    return Selector('.app-card__caption')
      .withText(`Move reference: ${referenceNumber}`)
      .parent('.app-card')
  }

  /**
   * Get definition list item value by key text
   *
   * @param {Selector} dl - definition list selector
   * @param {string} key - definition list item key text
   * @returns {Promise<string>} - definition list item description text
   */
  async getDlDefinitionByKey(dl, key) {
    return dl
      .find('dt')
      .withText(key)
      .sibling('dd').innerText
  }

  async getPersonLink(firstName, lastName) {
    return Selector('a').withText(`${lastName}, ${firstName}`.toUpperCase())
  }

  async getTagByLabel(label) {
    return Selector('.app-tag').withText(label)
  }

  async getElementScrollOffset(csselector) {
    return Selector(csselector).boundingClientRect
  }
}
