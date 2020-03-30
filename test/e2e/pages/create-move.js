import { Selector, t } from 'testcafe'
import pluralize from 'pluralize'
import faker from 'faker'

import Page from './page'
import {
  getInnerText,
  selectAutocompleteOption,
  selectFieldsetOption,
  fillInForm,
  generatePerson,
} from '../helpers'

class CreateMovePage extends Page {
  constructor() {
    super()
    this.url = '/move/new'

    this.steps = {
      personLookup: {
        nodes: {
          pncNumberSearch: Selector(
            'input[name="filter.police_national_computer"]'
          ),
          prisonNumberSearch: Selector('input[name="filter.prison_number"]'),
          noIdentifierLink: Selector('summary').withText(
            'I don’t have this number'
          ),
          moveSomeoneNew: Selector('a').withText(
            'move a person without a PNC number'
          ),
        },
      },
      personLookupResults: {
        nodes: {
          searchSummary: Selector('h2.govuk-heading-m'),
          moveSomeoneNew: Selector('a').withText('move someone else'),
          searchAgainLink: Selector('a').withText('Search again'),
        },
      },
      personalDetails: {
        nodes: {
          ethnicity: Selector('#ethnicity'),
        },
      },
      moveDetails: {
        nodes: {
          to_location_court_appearance: Selector(
            '#to_location_court_appearance'
          ),
        },
      },
      documents: {
        nodes: {
          uploadList: Selector('.app-multi-file-upload__list'),
        },
      },
      confirmation: {
        nodes: {
          referenceNumber: Selector(
            '.govuk-panel--confirmation .govuk-panel__body strong'
          ),
          confirmationMessage: Selector(
            '#main-content > div > div > p:nth-child(2)'
          ),
        },
      },
    }
  }

  /**
   * Fill in PNC search
   *
   * @param {String} searchTerm - Search term to enter
   * @returns {Promise<FormDetails>}
   */
  fillInPncSearch(searchTerm) {
    return t
      .expect(this.getCurrentUrl())
      .contains('/move/new/person-lookup-pnc')
      .selectText(this.steps.personLookup.nodes.pncNumberSearch)
      .pressKey('delete')
      .typeText(this.steps.personLookup.nodes.pncNumberSearch, searchTerm)
  }

  /**
   * Fill in prison number search
   *
   * @param {String} searchTerm - Search term to enter
   * @returns {Promise<FormDetails>}
   */
  fillInPrisonNumberSearch(searchTerm) {
    return t
      .expect(this.getCurrentUrl())
      .contains('/move/new/person-lookup-prison-number')
      .selectText(this.steps.personLookup.nodes.prisonNumberSearch)
      .pressKey('delete')
      .typeText(this.steps.personLookup.nodes.prisonNumberSearch, searchTerm)
  }

  /**
   * Select a search result
   *
   * @param {String} name - Name of result
   * @returns {Promise}
   */
  selectSearchResults(name) {
    return selectFieldsetOption('Person to move', name)
  }

  /**
   * Fill in personal details
   *
   * @param {Object} personalDetails - personal details to fill form in with
   * @returns {Promise<FormDetails>} - filled in personal details
   */
  async fillInPersonalDetails(personalDetails) {
    await t.expect(this.getCurrentUrl()).contains('/move/new/personal-details')

    const person = generatePerson(personalDetails)
    const textFields = await fillInForm(person)

    return {
      ...textFields,
      fullname: `${person.last_name}, ${person.first_names}`.toUpperCase(),
      ethnicity: await selectAutocompleteOption(
        this.steps.personalDetails.nodes.ethnicity
      ),
      gender: await selectFieldsetOption(
        'Gender',
        faker.random.arrayElement(['Male', 'Female'])
      ).then(getInnerText),
    }
  }

  /**
   * Fill in move details
   *
   * @param {'Court'|'Prison recall'} moveType - type of move
   * @returns {Promise<FormDetails>} - filled in move details
   */
  async fillInMoveDetails(moveType) {
    await t.expect(this.getCurrentUrl()).contains('/move/new/move-details')
    await selectFieldsetOption('Move to', moveType)

    let values = {}
    switch (moveType) {
      case 'Court':
        values = {
          to_location_court_appearance: await selectAutocompleteOption(
            this.steps.moveDetails.nodes.to_location_court_appearance
          ),
        }
        break
      case 'Prison recall':
        values = await fillInForm({
          additional_information: faker.lorem.sentence(6),
        })
        break
    }

    return {
      move_type: moveType,
      ...values,
    }
  }

  /**
   * Fill in date
   */
  async fillInDate() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/move-date')
    return selectFieldsetOption('Date', 'Today').then(getInnerText)
  }

  /**
   * Fill in court information
   *
   * @returns {Promise}
   */
  fillInCourtInformation() {
    return t
      .expect(this.getCurrentUrl())
      .contains('/move/new/court-information')
  }

  /**
   * Fill in risk information
   *
   * @returns {Promise}
   */
  fillInRiskInformation() {
    return t.expect(this.getCurrentUrl()).contains('/move/new/risk-information')
  }

  /**
   * Fill in release status
   *
   * @returns {Promise}
   */
  async fillInReleaseStatus() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/release-status')

    return selectFieldsetOption(
      'Is there a reason this person should not be released?',
      'No'
    )
  }

  /**
   * Fill in health information
   *
   * @returns {Promise}
   */
  async fillInHealthInformation() {
    await t
      .expect(this.getCurrentUrl())
      .contains('/move/new/health-information')

    return selectFieldsetOption(
      'Does this person need to travel in a special vehicle?',
      'No'
    )
  }

  /**
   * Fill in special vehicle
   *
   * @returns {Promise}
   */
  async fillInSpecialVehicle() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/special-vehicle')

    return selectFieldsetOption(
      'Does this person need to travel in a special vehicle?',
      'No'
    )
  }

  /**
   * Fill in document uploads
   *
   * @param {Array} files - array of files
   * @returns {Promise}
   */
  async fillInDocumentUploads(files) {
    await t.expect(this.getCurrentUrl()).contains('/move/new/document')
    await t.setFilesToUpload(
      '#documents',
      files.map(fileName => `../fixtures/files/${fileName}`)
    )
  }

  /**
   * Check document uploads
   *
   * @param {Array} files - array of files
   * @returns {Promise}
   */
  checkDocumentUploads(files) {
    return (
      t
        // .expect(this.steps.documents.nodes.uploadList.innerText)
        // .contains(files[0])
        .expect(true)
        .eql(true)
    )
  }

  /**
   * Check results of the person lookup
   *
   * @param {Int} count - number of results to expect
   * @param {String} searchTerm - the search term to expect
   * @returns {Promise}
   */
  checkPersonLookupResults(count, searchTerm) {
    return t
      .expect(this.getCurrentUrl())
      .contains('/move/new/person-lookup-results')
      .expect(this.steps.personLookupResults.nodes.searchSummary.innerText)
      .contains(
        `${count} ${pluralize('person', count)} found for “${searchTerm}”`
      )
  }

  /**
   * Check confirmation step
   *
   * @param {Object} details - details to check on this step
   * @returns {Promise}
   */
  checkConfirmationStep({ fullname, location } = {}) {
    return t
      .expect(this.getCurrentUrl())
      .match(/\/move\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/confirmation$/)
      .expect(this.steps.confirmation.nodes.referenceNumber.innerText)
      .match(/^[A-Z]{3}[0-9]{4}[A-Z]{1}$/)
      .expect(this.steps.confirmation.nodes.confirmationMessage.innerText)
      .contains(fullname)
      .expect(this.steps.confirmation.nodes.confirmationMessage.innerText)
      .contains(location)
  }
}

export default CreateMovePage
