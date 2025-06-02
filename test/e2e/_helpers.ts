import { unlinkSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

import { faker } from '@faker-js/faker'
import * as Sentry from '@sentry/node'
import { Context } from '@sentry/types'
import { format } from 'date-fns'
import glob from 'glob'
import { isArray, isNil } from 'lodash'
import { ClientFunction, RequestLogger, Selector, t } from 'testcafe'

// @ts-expect-error TODO: convert to TS
import referenceDataHelpers from '../../common/helpers/reference-data'
// @ts-expect-error TODO: convert to TS
import MoveService from '../../common/services/move'
// @ts-expect-error TODO: convert to TS
import PersonService from '../../common/services/person'
// @ts-expect-error TODO: convert to TS
import PersonEscortRecordService from '../../common/services/person-escort-record'
// @ts-expect-error TODO: convert to TS
import ProfileService from '../../common/services/profile'
// @ts-expect-error TODO: convert to TS
import ReferenceDataService from '../../common/services/reference-data'
import { Gender } from '../../common/types/gender'
import { SENTRY } from '../../config'
import { formatDate } from '../../config/nunjucks/filters'
// @ts-expect-error TODO: convert to TS
import assessmentFixtures from '../../mocks/assessment'

const req = {
  canAccess: function () {
    return true
  },
}

const personService = new PersonService(req)
const personEscortRecordService = new PersonEscortRecordService(req)
const moveService = new MoveService(req)
const profileService = new ProfileService(req)
const referenceDataService = new ReferenceDataService(req)

if (SENTRY.DSN) {
  Sentry.init({
    dsn: SENTRY.DSN,
    environment: SENTRY.ENVIRONMENT,
  })
}

/* eslint-disable no-process-env */
const {
  CIRCLE_BRANCH,
  CIRCLE_BUILD_NUM,
  CIRCLE_BUILD_URL,
  CIRCLE_WORKFLOW_ID,
} = process.env

/* eslint-disable no-process-env */

function errorHandler(body: Context) {
  return (err: Record<string, any>) => {
    Sentry.withScope(scope => {
      if (err.errors && err.errors.length > 0) {
        err.errors.forEach(({ title, ...rest }: any, idx: number) => {
          scope.setContext(`Error ${idx + 1}`, {
            ...rest,
            // `title` is a reserved property when using `setContext` and
            // will override the title passed as the first argument so it is
            // being set manually instead so that we don't lose the value
            error_title: title,
          })
        })

        scope.setContext('Errors', {
          Stringified: JSON.stringify(err.errors),
        })
      }

      scope.setContext('body', body)
      scope.setContext('circle', {
        'Workflow ID': CIRCLE_WORKFLOW_ID,
        'Job number': CIRCLE_BUILD_NUM,
        'Job URL': CIRCLE_BUILD_URL,
        Branch: CIRCLE_BRANCH,
      })
      Sentry.setTag('workflow_id', CIRCLE_WORKFLOW_ID)
      Sentry.setTag('job_number', CIRCLE_BUILD_NUM)
      Sentry.setTag('branch', CIRCLE_BRANCH)
      Sentry.captureException(err)
    })

    throw err
  }
}

export const scrollToTop = ClientFunction(() => {
  window.scrollTo(0, 0)
})

const filterDisabled = referenceDataHelpers.filterDisabled()

const getGenders = async () => {
  let genders = await referenceDataService.getGenders()
  genders = genders.filter(filterDisabled)
  return genders
}

const getEthnicities = async () => {
  let ethnicities = await referenceDataService.getEthnicities()
  ethnicities = ethnicities.filter(filterDisabled)
  return ethnicities
}

const generatePNCNumber = () => {
  const mod23chars = 'ZABCDEFGHJKLMNPQRTUVWXY'.split('')
  const date = new Date()
  const year = date.getFullYear().toString().substring(2)
  const number = faker.helpers.replaceSymbols('#######')
  const i = Number.parseInt(`${year}${number}`) % 23

  return `${year}/${number}${mod23chars[i]}`
}

export async function generatePerson(overrides = {}) {
  const firstNames = faker.person.firstName()
  const lastName = faker.person.lastName()

  let genders = await getGenders()
  // TODO: implement proper test to render male/female filter unnecessary
  genders = genders.filter((gender: Gender) =>
    gender.title.match(/^(Male|Female)$/i)
  )
  let ethnicities = await getEthnicities()
  ethnicities = ethnicities.filter(filterDisabled)

  const gender = faker.helpers.arrayElement(
    genders.map(({ title }: Gender) => title)
  )
  const ethnicity = faker.helpers.arrayElement(
    ethnicities.map(({ title }: { title: string }) => title)
  )

  return {
    lastName,
    firstNames,
    gender,
    ethnicity,
    fullname: `${lastName}, ${firstNames}`.toUpperCase(),
    policeNationalComputer: generatePNCNumber(),
    prisonNumber: faker.helpers.replaceSymbols('?####??'),
    criminalRecordsOffice: faker.helpers.fake('CRO/{{number.int}}'),
    nicheReference: faker.helpers.fake('NI/{{number.int}}'),
    athenaReference: faker.helpers.fake('AT/{{number.int}}'),
    dateOfBirth: format(
      faker.date.between({ from: '01-01-1940', to: '01-01-1990' }),
      'yyyy-MM-dd'
    ),
    ...overrides,
  }
}

export async function createPersonFixture(overrides = {}) {
  const fixture = await generatePerson(overrides)
  const genders = await getGenders()
  const ethnicities = await getEthnicities()

  const gender = genders.filter(
    (gen: Gender) => gen.title === fixture.gender
  )[0].id
  const ethnicity = ethnicities.filter(
    (eth: any) => eth.title === fixture.ethnicity
  )[0].id
  const data = {
    police_national_computer: fixture.policeNationalComputer,
    prison_number: fixture.prisonNumber,
    criminal_records_office: fixture.criminalRecordsOffice,
    niche_reference: fixture.nicheReference,
    athena_reference: fixture.athenaReference,
    last_name: fixture.lastName,
    first_names: fixture.firstNames,
    date_of_birth: fixture.dateOfBirth,
    ethnicity,
    gender,
  }

  return personService
    .create(data)
    .then((response: Record<string, any>) => {
      const getIdentifierValue = (type: string) => response[type]

      return {
        ...response,
        fullname:
          `${response.last_name}, ${response.first_names}`.toUpperCase(),
        lastName: response.last_name,
        firstNames: response.first_names,
        dateOfBirth: response.date_of_birth,
        gender: fixture.gender,
        ethnicity: fixture.ethnicity,
        prisonNumber: getIdentifierValue('prison_number'),
        policeNationalComputer: getIdentifierValue('police_national_computer'),
        criminalRecordsOffice: getIdentifierValue('criminal_records_office'),
        nicheReference: getIdentifierValue('niche_reference'),
        athenaReference: getIdentifierValue('athena_reference'),
      }
    })
    .catch(errorHandler(data))
}

/**
 * Generate profile data
 *
 * @param {string} personId - person id to use for profile
 *
 * @param {object} [overrides] - explicit values to use for profile
 *
 * @returns {object} - profile data
 */
export function generateProfile(personId: string | object, overrides = {}) {
  return {
    assessment_answers: [],
    person: {
      id: personId,
    },
    ...overrides,
  }
}

/**
 * Create a profile object
 *
 * @param {string} [personId] - person id to use for profile
 *
 * @param {object} [overrides] - explicit values to use for profile
 *
 * @returns {object} - created profile object
 */
export async function createProfileFixture(personId: string, overrides = {}) {
  const data = await generateProfile(overrides)

  return profileService.create(personId, data).catch(errorHandler(data))
}

/**
 * Get a random location
 *
 * @param {string} [locationType] - type of location
 *
 * @returns {string} - location id
 */
export async function getRandomLocation(
  locationType: string,
  { shouldHaveSupplier = false, filter }: any
) {
  let locations

  if (locationType) {
    locations = await referenceDataService.getLocationsByType([locationType])
  } else {
    locations = await referenceDataService.getLocations()
  }

  locations = locations
    .filter(filterDisabled)
    .filter((l: any) => (shouldHaveSupplier ? l.suppliers.length > 0 : true))

  if (filter) {
    locations = locations.filter(filter)
  }

  const locationIds = locations.map(({ id }: { id: string }) => id)

  return faker.helpers.arrayElement(locationIds)
}

/**
 * Generate move data
 *
 * @param {object} profile - config profile to attach to move
 *
 * @param {object} [options] - config options for move creation
 *
 * @param {object} [overrides] - explicit values to use for move
 *
 * @returns {object} - move data
 */
export async function generateMove(
  profile: any,
  options: any = {},
  overrides: any = {}
) {
  const fromLocationType = options.from_location_type || 'police'
  const toLocationType = options.to_location_type || 'court'
  const moveType = options.move_type || 'court_appearance'
  const move = {
    profile,
    move_type: moveType,
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    ...overrides,
  }

  if (!overrides.from_location) {
    const fromLocationOptions: any = { shouldHaveSupplier: true }

    if (overrides.to_location) {
      fromLocationOptions.filter = (l: any) => l.id !== overrides.to_location
    }

    move.from_location = await getRandomLocation(
      fromLocationType,
      fromLocationOptions
    )
  }

  if (!overrides.to_location) {
    move.to_location = await getRandomLocation(toLocationType, {
      filter: (l: any) => l.id !== move.from_location,
    })
  }

  const noToLocation = ['prison_recall', 'video_remand']

  if (noToLocation.includes(move.move_type)) {
    delete move.to_location
  }

  return move
}

/**
 * Create a move object
 *
 * @param {object} [personOverrides] - explicit values to use for person
 *
 * @param {object} [moveOverrides] - explicit values to use for move
 *
 * @param {object} [moveOptions] - config options for move creation
 *
 * @returns {object} - created move object containing person and profile data returned from create fixtures
 */
export async function createMoveFixture({
  personOverrides = {},
  profileOverrides = {},
  moveOverrides,
  moveOptions = {},
}: any = {}) {
  const person = await createPersonFixture(personOverrides)
  const profile = await createProfileFixture(person.id, profileOverrides)
  const data = await generateMove(profile, moveOptions, moveOverrides)

  return moveService
    .create(data, {
      include: ['from_location', 'to_location'],
    })
    .then((response: any) => {
      return {
        ...response,
        person,
        profile,
        moveType: response.move_type,
        additionalInformation: response.additional_information,
        [`${response.move_type}_comments`]: response.additional_information,
        fromLocation: response.from_location
          ? response.from_location.title
          : undefined,
        toLocation: response.to_location
          ? response.to_location.title
          : undefined,
      }
    })
    .catch(errorHandler(data))
}

export function acceptMove(moveId: string) {
  return moveService.accept(moveId)
}

export function startMove(moveId: string) {
  return moveService.start(moveId)
}

export function completeMove(moveId: string) {
  return moveService.complete(moveId)
}

export async function fillInPersonEscortRecord(moveId: string) {
  const move = await moveService.getById(moveId)
  const personEscortRecord = move.profile.person_escort_record
  const responses = assessmentFixtures.generateAssessmentRespones(
    personEscortRecord.responses
  )

  return personEscortRecordService
    .respond(personEscortRecord.id, responses)
    .catch(errorHandler(responses))
}

/**
 * Select option from selector
 *
 * @param {object} [item]
 * @param {Selector} [item.options] - TestCafe selector of options
 * @param {string|number|array} [item.value] - option text, 0-based index to select, or array it items to select
 *
 * @returns {string|array} - value of the selected item or array of items selected
 */
async function selectOption({
  options,
  value,
  skipFirst = false,
}: any): Promise<any> {
  if (isArray(value)) {
    const filledInValues = []

    for (const itemValue of value) {
      filledInValues.push(
        await selectOption({
          options,
          value: itemValue,
        })
      )
    }

    return Promise.resolve(filledInValues)
  }

  let option

  if (!isNil(value) && typeof value === 'string') {
    option = await options.withText(value)
  } else if (!isNil(value) && typeof value === 'number') {
    option = await options.nth(value)
  } else if (
    !isNil(value) &&
    typeof value === 'object' &&
    value.type === 'random' &&
    value.except
  ) {
    const filteredOptions = options.filter(
      (o: any) => o.innerText !== value.except,
      {
        value,
      }
    )
    const count = await filteredOptions.count
    const randomItem = Math.floor(Math.random() * count)
    option = await filteredOptions.nth(randomItem)
  } else {
    const count = skipFirst ? (await options.count) - 1 : await options.count

    const randomItem = skipFirst
      ? Math.floor(Math.random() * count) + 1
      : Math.floor(Math.random() * count)
    option = await options.nth(randomItem)
  }

  const optionFor = await option.getAttribute('for')

  if (optionFor) {
    const idOption = Selector('#' + optionFor)
    await t.click(idOption)
  } else {
    await t.click(option)
  }

  return option.innerText
}

// TODO this can be deleted?
/**
 * Fill in an autocomplete field
 *
 * @param {object} [field]
 * @param {Selector} [field.selector] - A TestCafe selector
 * @param {string|number} [field.value] - Text value or index to select. If undefined, will select a random item
 *
 * @returns {string} - value of the selected item
 */
export async function fillAutocomplete({
  selector,
  value,
}: {
  selector: Selector
  value: string | number
}) {
  await t.click(selector).selectText(selector).pressKey('delete')

  const optionsSelector = '.autocomplete__menu .autocomplete__option'
  const autocompleteMenuOptions = await selector
    .parent('.govuk-form-group')
    .find(optionsSelector)

  return selectOption({
    value,
    options: autocompleteMenuOptions,
  })
}

/**
 * Fill in a radio or checkbox field
 *
 * @param {object} [field]
 * @param {Selector} [field.selector] - A TestCafe selector of radios or checkboxes
 * @param {string|number} [field.value] - Text value or index to select. If undefined, will select a random item
 *
 * @returns {string|array} - value of the selected item or array of items selected
 */
export function fillRadioOrCheckbox({
  selector,
  value,
}: {
  selector: Selector
  value: string | number
}) {
  const options = selector
    .parent('fieldset')
    .nth(0)
    .child('.govuk-radios, .govuk-checkboxes')
    .child('.govuk-radios__item, .govuk-checkboxes__item')
    .find('[type="radio"] ~ label, [type="checkbox"] ~ label')
  return selectOption({
    value,
    options,
  })
}

/**
 * Select an option from a drop down list
 *
 * @param {object} [field]
 * @param {Selector} [field.selector] - A TestCafe selector of radios or checkboxes
 * @param {string|number} [field.value] - Text value or index to select. If undefined, will select a random item
 *
 * @returns {string|array} - value of the selected item or array of items selected
 */
export async function fillDdl({
  selector,
  value,
}: {
  selector: Selector
  value: string | number
}) {
  await t.click(selector)
  const options = await selector.child('option')
  const skipFirst = true

  return selectOption({
    options,
    value,
    skipFirst,
  })
}

/**
 * Fill in a text or textarea field
 *
 * @param {object} [field]
 * @param {Selector} [field.selector] - A TestCafe selector
 * @param {string|number} [field.value] - Text value to enter
 *
 * @returns {string} - value of the selected item
 */
export async function fillTextField({
  selector,
  value,
}: {
  selector: Selector
  value: string
}) {
  await t.typeText(selector, value, { replace: true })
  return selector.value
}

/**
 * Fill in form details on page
 *
 * @param {array} [fields] - An array of fields to fill in
 * @param {Selector} [fields.selector] - TestCafe selector of field element
 * @param {string} [fields.value] - Value to enter/select
 * @param {string} [fields.type] - Type of field. Can be `autocomplete`, `radio`, `checkbox`
 *
 * @returns {object} - object of filled in values
 */
export async function fillInForm(fields: any = {}) {
  const filledInFields: Record<string, any> = {}

  for (const [key, field] of Object.entries(fields) as any) {
    switch (field.type) {
      case 'ddl':
        filledInFields[key] = await fillDdl(field)
        break
      case 'autocomplete':
        filledInFields[key] = await fillAutocomplete(field)
        break
      case 'radio':
      case 'checkbox':
        filledInFields[key] = await fillRadioOrCheckbox(field)
        break
      default:
        filledInFields[key] = await fillTextField({
          ...field,
          value: String(field.value),
        })
        break
    }
  }

  return filledInFields
}

/**
 * Get CSV files downloaded from the app today (glob pattern matched)
 *
 * @returns {string[]}
 */
export function getCsvDownloadFilePaths() {
  const dateStamp = format(new Date(), 'yyyy-MM-dd')
  const globPattern = `${join(
    homedir(),
    'Downloads'
  )}/Moves on*(Downloaded ${dateStamp}*.csv*`
  return glob.sync(globPattern)
}

/**
 * Wait for the csvDownload path to exist. Handy when the files are downloading
 * @param delay
 * @returns {string[]}
 */
export async function waitForCsvDownloadFilePaths(delay = 2000) {
  await t.wait(delay)
  const csvDownloadFilePaths = getCsvDownloadFilePaths()

  if (csvDownloadFilePaths.length) {
    return csvDownloadFilePaths
  }
}

/**
 * Clean existing downloads
 *
 * @returns {}
 */
export function deleteCsvDownloads() {
  const csvDownloads = getCsvDownloadFilePaths()

  for (const file of csvDownloads) {
    try {
      unlinkSync(file)
    } catch (err) {
      throw new Error(
        `Failed to delete CSV download file: ${(err as Error).message}`
      )
    }
  }
}

/**
 * Create TestCafe RequestLogger
 *
 * @param {string} baseUrl - Base url to capture requests
 *
 * @returns {object} - logger
 */
export function createLogger(baseUrl: string) {
  return RequestLogger(request => {
    if (request.url.match(/\.(js|css|woff|woff2|gif|svg|jpg|png)$/)) {
      return false
    }

    if (request.url.startsWith(`${baseUrl}/connect`)) {
      return false
    }

    if (request.url.startsWith(`${baseUrl}/browser-sync`)) {
      return false
    }

    return request.url.startsWith(baseUrl)
  });
}

/**
 * Get logged response values for a url
 *
 * @param {string} url - URL to match
 *
 * @returns {object} - logger response object
 */
export function getLoggerResponse(logger: RequestLogger, url: string) {
  const response =
    logger.requests
      .filter(req => req.request.url === url)
      .map(req => req.response)[0] || {}
  return response
}

/**
 * Get status code for a url
 *
 * @param {string} url - URL to match
 *
 * @returns {number} - status code
 */
export function getResponseStatus(logger: RequestLogger, url: string) {
  return getLoggerResponse(logger, url).statusCode
}

/**
 * Check status code for a url
 *
 * @param {string} url - URL to check
 *
 * @param {number} statusCode - Expected status code
 *
 * @param {boolean} [negated] - whether to negate the assertion
 *
 * @returns {Promise<boolean>}
 */
export async function expectStatusCode(
  url: string,
  statusCode: number,
  negated = true
) {
  const logger = createLogger(url)
  await t.addRequestHooks(logger)
  await t.navigateTo(url)
  const expectMethod = negated === false ? 'notEql' : 'eql'
  await t.expect(getResponseStatus(logger, url))[expectMethod](statusCode)
  await t.removeRequestHooks(logger)
}
