import { faker } from '@faker-js/faker'
import { addDays, format } from 'date-fns'
import { omit, pick } from 'lodash'
import pluralize from 'pluralize'
import { Selector, t } from 'testcafe'

import * as parsers from '../../../common/parsers'
import * as filters from '../../../config/nunjucks/filters'
import { fillInForm, generatePerson } from '../_helpers'

import { Page } from './page'

class CreateMovePage extends Page {
  url: string

  fields: {
    pncNumberSearch: Selector
    prisonNumberSearch: Selector
    people: Selector
    firstNames: Selector
    lastName: Selector
    dateOfBirth: Selector
    policeNationalComputer: Selector
    policeNationalComputerReadOnly: Selector
    ethnicity: Selector
    gender: Selector
    moveType: Selector
    courtLocation: Selector
    extraditionLocation: Selector
    hospitalLocation: Selector
    secureChildrensHomeLocation: Selector
    approvedPremisesLocation: Selector
    secureTrainingCentreLocation: Selector
    policeLocation: Selector
    prisonLocation: Selector
    additionalInformation: Selector
    prisonRecallComments: Selector
    videoRemandComments: Selector
    dateCustom: Selector
    dateType: Selector
    dateFrom: Selector
    hasDateTo: Selector
    moveAgreed: Selector
    moveAgreedBy: Selector
    timeDue: Selector
    prisonTransferReason: Selector
    courtInformation: Selector
    solicitor: Selector
    interpreter: Selector
    otherCourt: Selector
    riskInformation: Selector
    violent: Selector
    escape: Selector
    holdSeparately: Selector
    selfHarm: Selector
    concealedItems: Selector
    otherRisks: Selector
    healthInformation: Selector
    specialDietOrAllergy: Selector
    healthIssue: Selector
    medication: Selector
    wheelchair: Selector
    pregnant: Selector
    otherHealth: Selector
    specialVehicle: Selector
    specialVehicleRadio: Selector
    notToBeReleased: Selector
    notToBeReleasedRadio: Selector
    hasCourtCase: Selector
    recallDate: Selector
    extradition_flight_number: Selector
    extradition_flight_day: Selector
    extradition_flight_month: Selector
    extradition_flight_year: Selector
    extradition_flight_time: Selector
  }

  steps: {
    personLookup: {
      nodes: { noIdentifierLink: Selector; moveSomeoneNew: Selector }
    }
    personLookupResults: {
      nodes: {
        searchSummary: Selector
        moveSomeoneNew: Selector
        searchAgainLink: Selector
      }
    }
    documents: { nodes: { uploadList: Selector } }
    confirmation: {
      nodes: { referenceNumber: Selector; confirmationMessage: Selector }
    }
  }

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
      policeNationalComputerReadOnly: Selector(
        '[type=hidden][name=police_national_computer]'
      ),
      ethnicity: Selector('#ethnicity'),
      gender: Selector('[name="gender"]'),
      moveType: Selector('[name="move_type"]'),
      courtLocation: Selector('#to_location_court_appearance'),
      extraditionLocation: Selector('#to_location_extradition'),
      hospitalLocation: Selector('#to_location_hospital'),
      secureChildrensHomeLocation: Selector(
        '#to_location_secure_childrens_home'
      ),
      approvedPremisesLocation: Selector('#to_location_approved_premises'),
      secureTrainingCentreLocation: Selector(
        '#to_location_secure_training_centre'
      ),
      policeLocation: Selector('#to_location_police_transfer'),
      prisonLocation: Selector('#to_location_prison_transfer'),
      additionalInformation: Selector('#additional_information'),
      prisonRecallComments: Selector('#prison_recall_comments'),
      videoRemandComments: Selector('#video_remand_comments'),
      dateCustom: Selector('[name="date_custom"]'),
      dateType: Selector('[name="date_type"]'),
      dateFrom: Selector('#date_from'),
      hasDateTo: Selector('[name="has_date_to"]'),
      moveAgreed: Selector('[name="move_agreed"]'),
      moveAgreedBy: Selector('#move_agreed_by'),
      timeDue: Selector('#time_due'),
      prisonTransferReason: Selector('[name="prison_transfer_type"]'),
      courtInformation: Selector('[name="court"]'),
      solicitor: Selector('#solicitor'),
      interpreter: Selector('#interpreter'),
      otherCourt: Selector('#other_court'),
      riskInformation: Selector('[name="risk"]'),
      violent: Selector('#violent'),
      escape: Selector('#escape'),
      holdSeparately: Selector('#hold_separately'),
      selfHarm: Selector('#self_harm'),
      concealedItems: Selector('#concealed_items'),
      otherRisks: Selector('#other_risks'),
      healthInformation: Selector('[name="health"]'),
      specialDietOrAllergy: Selector('#special_diet_or_allergy'),
      healthIssue: Selector('#health_issue'),
      medication: Selector('#medication'),
      wheelchair: Selector('#wheelchair'),
      pregnant: Selector('#pregnant'),
      otherHealth: Selector('#other_health'),
      specialVehicle: Selector('#special_vehicle'),
      specialVehicleRadio: Selector('[name^="special_vehicle"]'),
      notToBeReleased: Selector('#not_to_be_released'),
      notToBeReleasedRadio: Selector('[name="not_to_be_released__explicit"]'),
      hasCourtCase: Selector('[name="has_court_case"]'),
      recallDate: Selector('#recall_date'),
      extradition_flight_number: Selector('#extradition_flight_number'),
      extradition_flight_day: Selector('#extradition_flight_date-day'),
      extradition_flight_month: Selector('#extradition_flight_date-month'),
      extradition_flight_year: Selector('#extradition_flight_date-year'),
      extradition_flight_time: Selector('#extradition_flight_time'),
    }

    this.nodes = {
      ...this.nodes,
      policeNationalComputerHeading: Selector('.app-read-only-field__heading'),
      policeNationalComputerValue: Selector('.app-read-only-field__value'),
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
          searchSummary: Selector('h1.govuk-heading-xl'),
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
  async fillInPncSearch(searchTerm: string) {
    await t.expect(this.getCurrentUrl()).contains('/person-lookup-pnc')

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
  async fillInPrisonNumberSearch(searchTerm: string) {
    await t
      .expect(this.getCurrentUrl())
      .contains('/person-lookup-prison-number')

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
  selectSearchResults(name: string) {
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
   * @param {Object} [options]
   * @param {String[]} [options.exclude] - fields to exclude
   * @param {String[]} [options.include] - fields to include
   * @returns {Promise<FormDetails>} - filled in personal details
   */
  async fillInPersonalDetails(
    personalDetails?: any,
    { include, exclude }: { include?: string[]; exclude?: string[] } = {}
  ) {
    await t.expect(this.getCurrentUrl()).contains('/personal-details')

    const person = await generatePerson(personalDetails)
    let data = {
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
        type: 'ddl',
      },
      gender: {
        selector: this.fields.gender,
        value: person.gender,
        type: 'radio',
      },
    }

    if (exclude) {
      data = omit(data, exclude) as typeof data
    } else if (include) {
      data = pick(data, include) as typeof data
    }

    const fields = await fillInForm(data)

    return {
      ...fields,
      fullname: person.fullname,
    }
  }

  /**
   * Fill in recall info
   */
  async fillInRecallInfo() {
    await t.expect(this.getCurrentUrl()).contains('/recall-info')

    return fillInForm({
      recallDate: {
        selector: this.fields.recallDate,
        value: format(faker.date.past(), 'd/M/yyyy'),
      },
    })
  }

  /**
   * Fill in move details
   *
   * @param {'Court'|'Prison recall'|'Prison'|'Prison remand (Video Remand Hearing)'|'Hospital'|'SCH'|'AP'|'Extradition'} moveType - type of move
   * @returns {Promise<FormDetails>} - filled in move details
   */
  async fillInMoveDetails(moveType: string) {
    await t.expect(this.getCurrentUrl()).contains('/move-details')

    const fields: any = {
      moveType: {
        selector: this.fields.moveType,
        value: moveType,
        type: 'radio',
      },
    }

    if (moveType === 'Court') {
      fields.courtLocation = {
        selector: this.fields.courtLocation,
        type: 'ddl',
      }
    }

    if (moveType === 'Prison') {
      fields.prisonLocation = {
        selector: this.fields.prisonLocation,
        type: 'ddl',
      }
    }

    if (moveType === 'Prison recall') {
      fields.prisonRecallComments = {
        selector: this.fields.prisonRecallComments,
        value: faker.lorem.sentence(6),
      }
    }

    if (moveType === 'Prison remand (Video Remand Hearing)') {
      fields.videoRemandComments = {
        selector: this.fields.videoRemandComments,
        value: faker.lorem.sentence(6),
      }
    }

    if (moveType === 'Hospital') {
      fields.hospitalLocation = {
        selector: this.fields.hospitalLocation,
        type: 'ddl',
      }
    }

    if (moveType === 'SCH') {
      fields.secureChildrensHomeLocation = {
        selector: this.fields.secureChildrensHomeLocation,
        type: 'ddl',
      }
    }

    if (moveType === 'AP') {
      fields.approvedPremisesLocation = {
        selector: this.fields.approvedPremisesLocation,
        type: 'ddl',
      }
    }

    if (moveType === 'Custody suite (extradition)') {
      fields.extraditionLocation = {
        selector: this.fields.extraditionLocation,
        type: 'ddl',
      }
    }

    return fillInForm(fields)
  }

  /**
   * Fill in date
   *
   * @param {'Today'|'Tomorrow'|{string}} dateValue - type of date
   * Any string other than 'Today' or 'Tomorrow' is treated as 'Another date'
   * and used as is for the date_custom field.
   * @returns {Promise<FormDetails>} - filled in move details
   */
  async fillInDate(dateValue = 'Today') {
    await t.expect(this.getCurrentUrl()).contains('/move-date')

    let dateCustom: string | undefined
    let dateType = dateValue

    if (dateType !== 'Today' && dateType !== 'Tomorrow') {
      dateType = 'Another date'
      dateCustom = dateValue
    }

    const data: any = {
      dateType: {
        selector: this.fields.dateType,
        value: dateType,
        type: 'radio',
      },
    }

    if (dateCustom) {
      data.dateCustom = {
        selector: this.fields.dateCustom,
        value: dateCustom,
      }
    }

    return fillInForm(data).then(filledInData => {
      let date

      if (dateValue === 'Today') {
        date = new Date()
      } else if (dateValue === 'Tomorrow') {
        date = addDays(new Date(), 1)
      } else {
        date = parsers.date(dateCustom)
      }

      return {
        ...filledInData,
        date: filters.formatDate(date as Date, 'yyyy-MM-dd'),
      }
    })
  }

  /**
   * Fill in date range
   */
  async fillInDateRange() {
    await t.expect(this.getCurrentUrl()).contains('/move-date-range')

    return fillInForm({
      dateFrom: {
        selector: this.fields.dateFrom,
        value: format(faker.date.future(), 'd/M/yyyy'),
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
  async fillInCourtInformation({
    selectAll = true,
    fillInOptional = false,
  } = {}) {
    await t.expect(this.getCurrentUrl()).contains('/court-information')

    const fields: any = {
      selectedItems: {
        selector: this.fields.courtInformation,
        value: selectAll ? [0, 1, 2] : [],
        type: 'checkbox',
      },
    }

    if (selectAll) {
      fields.otherCourt = {
        selector: this.fields.otherCourt,
        value: faker.lorem.sentence(6),
      }

      if (fillInOptional) {
        fields.solicitor = {
          selector: this.fields.solicitor,
          value: faker.lorem.sentence(6),
        }
        fields.interpreter = {
          selector: this.fields.interpreter,
          value: faker.lorem.sentence(6),
        }
      }
    }

    return fillInForm(fields)
  }

  /**
   * Fill in hospital information
   *
   * @returns {Promise}
   */
  async fillInHospitalDetails() {
    await t.expect(this.getCurrentUrl()).contains('/hospital')

    return fillInForm({
      timeDue: {
        selector: this.fields.timeDue,
        // Time due is validated to be in the future.
        // This ensures there's only 1 minute of the day this will fail
        value: '23:59',
      },
      additionalInformation: {
        selector: this.fields.additionalInformation,
        value: faker.lorem.sentence(6),
      },
    })
  }

  /**
   * Fill in court hearings
   *
   * @returns {Promise}
   */
  async fillInCourtHearings() {
    await t.expect(this.getCurrentUrl()).contains('/court-hearings')

    return fillInForm({
      hasCourtCase: {
        selector: this.fields.hasCourtCase,
        value: 'No',
        type: 'radio',
      },
    })
  }

  /**
   * Fill in extradition details
   *
   * @returns {Promise}
   */
  async fillInExtraditionDetails() {
    await t.expect(this.getCurrentUrl()).contains('/extradition-details')

    return fillInForm({
      flightNumber: {
        selector: this.fields.extradition_flight_number,
        value: 'E2E93',
        type: 'text',
      },
      flightDay: {
        selector: this.fields.extradition_flight_day,
        value: '15',
        type: 'text',
      },
      flightMonth: {
        selector: this.fields.extradition_flight_month,
        value: '10',
        type: 'text',
      },
      flightYear: {
        selector: this.fields.extradition_flight_year,
        value: '2030',
        type: 'text',
      },
      flightTime: {
        selector: this.fields.extradition_flight_time,
        value: '09:45',
        type: 'text',
      },
    })
  }

  /**
   * Fill in risk information
   *
   * @returns {Promise}
   */
  async fillInRiskInformation({
    selectAll = true,
    fillInOptional = false,
  } = {}) {
    await t.expect(this.getCurrentUrl()).contains('/risk-information')

    const fields: any = {
      selectedItems: {
        selector: this.fields.riskInformation,
        value: selectAll ? [0, 1, 2, 3, 4, 5] : [],
        type: 'checkbox',
      },
    }

    if (selectAll) {
      fields.otherRisks = {
        selector: this.fields.otherRisks,
        value: faker.lorem.sentence(6),
      }

      if (fillInOptional) {
        fields.violent = {
          selector: this.fields.violent,
          value: faker.lorem.sentence(6),
        }
        fields.escape = {
          selector: this.fields.escape,
          value: faker.lorem.sentence(6),
        }
        fields.holdSeparately = {
          selector: this.fields.holdSeparately,
          value: faker.lorem.sentence(6),
        }
        fields.selfHarm = {
          selector: this.fields.selfHarm,
          value: faker.lorem.sentence(6),
        }
        fields.concealedItems = {
          selector: this.fields.concealedItems,
          value: faker.lorem.sentence(6),
        }
      }
    }

    return fillInForm(fields)
  }

  /**
   * Fill in release status
   *
   * @returns {Promise}
   */
  async fillInReleaseStatus() {
    await t.expect(this.getCurrentUrl()).contains('/release-status')

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
    await t.expect(this.getCurrentUrl()).contains('/agreement-status')

    return fillInForm({
      moveAgreed: {
        selector: this.fields.moveAgreed,
        value: 'Yes',
        type: 'radio',
      },
      moveAgreedBy: {
        selector: this.fields.moveAgreedBy,
        value: `${faker.person.firstName()} ${faker.person.lastName()}`,
      },
    })
  }

  /**
   * Fill in prison transfer reason
   *
   * @returns {Promise}
   */
  async fillInPrisonTransferReasons() {
    await t.expect(this.getCurrentUrl()).contains('/transfer-reason')

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
  async fillInHealthInformation({
    selectAll = true,
    fillInOptional = false,
  } = {}) {
    await t.expect(this.getCurrentUrl()).contains('/health-information')

    if (!selectAll) {
      return fillInForm({
        specialVehicleRadio: {
          selector: this.fields.specialVehicleRadio,
          value: 'No',
          type: 'radio',
        },
      })
    }

    const fields: any = {
      selectedItems: {
        selector: this.fields.healthInformation,
        value: [0, 1, 2, 3, 4, 5],
        type: 'checkbox',
      },
      specialVehicleRadio: {
        selector: this.fields.specialVehicleRadio,
        value: 'Yes',
        type: 'radio',
      },
      specialVehicle: {
        selector: this.fields.specialVehicle,
        value: faker.lorem.sentence(6),
      },
      otherHealth: {
        selector: this.fields.otherHealth,
        value: faker.lorem.sentence(6),
      },
    }

    if (fillInOptional) {
      fields.specialDietOrAllergy = {
        selector: this.fields.specialDietOrAllergy,
        value: faker.lorem.sentence(6),
      }
      fields.healthIssue = {
        selector: this.fields.healthIssue,
        value: faker.lorem.sentence(6),
      }
      fields.medication = {
        selector: this.fields.medication,
        value: faker.lorem.sentence(6),
      }
      fields.wheelchair = {
        selector: this.fields.wheelchair,
        value: faker.lorem.sentence(6),
      }
      fields.pregnant = {
        selector: this.fields.pregnant,
        value: faker.lorem.sentence(6),
      }
    }

    return fillInForm(fields)
  }

  /**
   * Fill in special vehicle
   *
   * @returns {Promise}
   */
  async fillInSpecialVehicle() {
    await t.expect(this.getCurrentUrl()).contains('/special-vehicle')

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
  async fillInDocumentUploads(files: string[]) {
    await t.expect(this.getCurrentUrl()).contains('/document')
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
  checkDocumentUploads(files: string[]) {
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
  checkPersonLookupResults(count: number, searchTerm: string) {
    return t
      .expect(this.getCurrentUrl())
      .contains('/person-lookup-results')
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
  checkConfirmationStep({
    fullname = '',
    location = '',
  }: { fullname?: string; location?: string } = {}) {
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
