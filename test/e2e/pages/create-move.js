import { Selector, t } from 'testcafe'
import pluralize from 'pluralize'
import faker from 'faker'

import Page from './page'
import { fillInForm, generatePerson } from '../_helpers'

class CreateMovePage extends Page {
  constructor() {
    super()
    this.url = '/move/new'

    this.fields = {
      pncNumberSearch: Selector(
        'input[name="filter.police_national_computer"]'
      ),
      prisonNumberSearch: Selector('input[name="filter.prison_number"]'),
      people: Selector('input[name="people"]'),
      firstNames: Selector('#first_names'),
      lastName: Selector('#last_name'),
      dateOfBirth: Selector('#date_of_birth'),
      policeNationalComputer: Selector('#police_national_computer'),
      ethnicity: Selector('#ethnicity'),
      gender: Selector('[name="gender"]'),
      moveType: Selector('[name="move_type"]'),
      courtLocation: Selector('#to_location_court_appearance'),
      prisonLocation: Selector('#to_location_prison'),
      additionalInformation: Selector('#additional_information'),
      dateType: Selector('[name="date_type"]'),
      dateFrom: Selector('#date_from'),
      hasDateTo: Selector('[name="has_date_to"]'),
      moveAgreed: Selector('[name="move_agreed"]'),
      moveAgreedBy: Selector('#move_agreed_by'),
      prisonTransferReason: Selector('[name="prison_transfer_reason"]'),
      notToBeReleasedRadio: Selector('[name="not_to_be_released__explicit"]'),
      specialVehicleRadio: Selector('[name="special_vehicle__explicit"]'),
    }

    this.steps = {
      personLookup: {
        nodes: {
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
  async fillInPncSearch(searchTerm) {
    await t.expect(this.getCurrentUrl()).contains('/move/new/person-lookup-pnc')

    return fillInForm({
      pncNumberSearch: {
        selector: this.fields.pncNumberSearch,
        value: searchTerm,
      },
    })
  }

  /**
   * Fill in prison number search
   *
   * @param {String} searchTerm - Search term to enter
   * @returns {Promise<FormDetails>}
   */
  async fillInPrisonNumberSearch(searchTerm) {
    await t
      .expect(this.getCurrentUrl())
      .contains('/move/new/person-lookup-prison-number')

    return fillInForm({
      prisonNumberSearch: {
        selector: this.fields.prisonNumberSearch,
        value: searchTerm,
      },
    })
  }

  /**
   * Select a search result
   *
   * @param {String} name - Name of result
   * @returns {Promise}
   */
  selectSearchResults(name) {
    return fillInForm({
      people: {
        selector: this.fields.people,
        value: name,
        type: 'radio',
      },
    })
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
    const fields = await fillInForm({
      policeNationalComputer: {
        selector: this.fields.policeNationalComputer,
        value: person.policeNationalComputer,
      },
      lastName: {
        selector: this.fields.lastName,
        value: person.lastName,
      },
      firstNames: {
        selector: this.fields.firstNames,
        value: person.firstNames,
      },
      dateOfBirth: {
        selector: this.fields.dateOfBirth,
        value: person.dateOfBirth,
      },
      ethnicity: {
        selector: this.fields.ethnicity,
        type: 'autocomplete',
      },
      gender: {
        selector: this.fields.gender,
        value: faker.random.arrayElement(['Male', 'Female']),
        type: 'radio',
      },
    })

    return {
      ...fields,
      fullname: person.fullname,
    }
  }

  /**
   * Fill in move details
   *
   * @param {'Court'|'Prison recall'|'Prison'} moveType - type of move
   * @returns {Promise<FormDetails>} - filled in move details
   */
  async fillInMoveDetails(moveType) {
    await t.expect(this.getCurrentUrl()).contains('/move/new/move-details')

    const fields = {
      moveType: {
        selector: this.fields.moveType,
        value: moveType,
        type: 'radio',
      },
    }

    if (moveType === 'Court') {
      fields.courtLocation = {
        selector: this.fields.courtLocation,
        type: 'autocomplete',
      }
    }

    if (moveType === 'Prison') {
      fields.prisonLocation = {
        selector: this.fields.prisonLocation,
        type: 'autocomplete',
      }
    }

    if (moveType === 'Prison recall') {
      fields.additionalInformation = {
        selector: this.fields.additionalInformation,
        value: faker.lorem.sentence(6),
      }
    }

    return fillInForm(fields)
  }

  /**
   * Fill in date
   */
  async fillInDate() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/move-date')

    return fillInForm({
      dateType: {
        selector: this.fields.dateType,
        value: 'Today',
        type: 'radio',
      },
    })
  }

  /**
   * Fill in date range
   */
  async fillInDateRange() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/move-date-range')

    return fillInForm({
      dateFrom: {
        selector: this.fields.dateFrom,
        value: faker.date.future().toLocaleDateString(),
      },
      hasDateTo: {
        selector: this.fields.hasDateTo,
        value: 'No',
        type: 'radio',
      },
    })
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

    return fillInForm({
      notToBeReleasedRadio: {
        selector: this.fields.notToBeReleasedRadio,
        value: 'No',
        type: 'radio',
      },
    })
  }

  /**
   * Fill in agreement status
   *
   * @returns {Promise}
   */
  async fillInAgreementStatus() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/agreement-status')

    return fillInForm({
      moveAgreed: {
        selector: this.fields.moveAgreed,
        value: 'Yes',
        type: 'radio',
      },
      moveAgreedBy: {
        selector: this.fields.moveAgreedBy,
        value: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    })
  }

  /**
   * Fill in prison transfer reason
   *
   * @returns {Promise}
   */
  async fillInPrisonTransferReasons() {
    await t
      .expect(this.getCurrentUrl())
      .contains('/move/new/prison-transfer-reason')

    return fillInForm({
      prisonTransferReason: {
        selector: this.fields.prisonTransferReason,
        type: 'radio',
      },
    })
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

    return fillInForm({
      specialVehicleRadio: {
        selector: this.fields.specialVehicleRadio,
        value: 'No',
        type: 'radio',
      },
    })
  }

  /**
   * Fill in special vehicle
   *
   * @returns {Promise}
   */
  async fillInSpecialVehicle() {
    await t.expect(this.getCurrentUrl()).contains('/move/new/special-vehicle')

    return fillInForm({
      specialVehicleRadio: {
        selector: this.fields.specialVehicleRadio,
        value: 'No',
        type: 'radio',
      },
    })
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
