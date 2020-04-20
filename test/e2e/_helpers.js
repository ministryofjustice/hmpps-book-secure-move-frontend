import { unlinkSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

import { format } from 'date-fns'
import faker from 'faker'
import glob from 'glob'
import { find, get, isArray, isNil } from 'lodash'
import { ClientFunction, RequestLogger, t } from 'testcafe'

import moveService from '../../common/services/move'
import personService from '../../common/services/person'
import referenceDataService from '../../common/services/reference-data'
import { formatDate } from '../../config/nunjucks/filters'

let referenceData
let genders
let ethnicities
let locations

const getReferenceData = async () => {
  genders = await referenceDataService.getGenders()
  genders = genders.filter(gender => gender.title.match(/^(Male|Female)$/i))
  ethnicities = await referenceDataService.getEthnicities()
  locations = await referenceDataService.getLocations()
  referenceData = true
}

export const scrollToTop = ClientFunction(() => {
  window.scrollTo(0, 0)
})

export async function generatePerson(overrides = {}) {
  if (!referenceData) {
    await getReferenceData()
  }
  const firstNames = faker.name.firstName()
  const lastName = faker.name.lastName()
  const gender = faker.random.arrayElement(genders.map(({ title }) => title))
  const ethnicity = faker.random.arrayElement(
    ethnicities.map(({ title }) => title)
  )
  return {
    lastName,
    firstNames,
    gender,
    ethnicity,
    fullname: `${lastName}, ${firstNames}`.toUpperCase(),
    policeNationalComputer: faker
      .fake('{{random.alphaNumeric(6)}}/{{random.alphaNumeric(2)}}')
      .toUpperCase(),
    prisonNumber: faker.fake(
      '{{helpers.replaceSymbols("?")}}{{random.number}}{{helpers.replaceSymbols("??")}}'
    ),
    criminalRecordsOffice: faker.fake('CRO/{{random.number}}'),
    nicheReference: faker.fake('NI/{{random.number}}'),
    athenaReference: faker.fake('AT/{{random.number}}'),
    dateOfBirth: format(
      faker.date.between('01-01-1940', '01-01-1990'),
      'yyyy-MM-dd'
    ),
    ...overrides,
  }
}

export async function createPersonFixture(overrides = {}) {
  const fixture = await generatePerson(overrides)

  const gender = genders.filter(gen => gen.title === fixture.gender)[0].id
  const ethnicity = ethnicities.filter(
    eth => eth.title === fixture.ethnicity
  )[0].id
  const person = await personService.create({
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
  })

  return {
    ...person,
    fullname: `${person.last_name}, ${person.first_names}`.toUpperCase(),
    lastName: person.last_name,
    firstNames: person.first_names,
    dateOfBirth: person.date_of_birth,
    gender: fixture.gender,
    ethnicity: fixture.ethnicity,
    prisonNumber: find(person.identifiers, {
      identifier_type: 'prison_number',
    }).value,
    policeNationalComputer: get(
      find(person.identifiers, {
        identifier_type: 'police_national_computer',
      }),
      'value'
    ),
    criminalRecordsOffice: find(person.identifiers, {
      identifier_type: 'criminal_records_office',
    }).value,
    nicheReference: find(person.identifiers, {
      identifier_type: 'niche_reference',
    }).value,
    athenaReference: find(person.identifiers, {
      identifier_type: 'athena_reference',
    }).value,
  }
}

/**
 * Get a random location
 *
 * @param {string} [locationType=police] - type of location
 *
 * @returns {string} - location id
 */
const getRandomLocation = (locationType = 'police') => {
  return faker.random.arrayElement(
    locations
      .filter(loc => loc.location_type === locationType)
      .map(({ id }) => id)
  )
}

/**
 * Generate move data
 *
 * @param {object} [moveOverrides] - explicit values to use for move
 *
 * @param {object} [moveOptions] - config options for move creation
 *
 * @returns {object} - move data
 */
export function generateMove(personId, options = {}, overrides = {}) {
  const fromLocationType = options.from_location_type || 'police'
  const toLocationType = options.to_location_type || 'court'
  getRandomLocation()
  return {
    person: {
      id: personId,
    },
    from_location: getRandomLocation(fromLocationType),
    to_location: getRandomLocation(toLocationType),
    move_type: 'court_appearance',
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    ...overrides,
  }
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
 * @returns {object} - created move object containing person data retunred from createPersonFixture
 */
export async function createMoveFixture({
  personOverrides = {},
  moveOverrides,
  moveOptions = {},
} = {}) {
  const person = await createPersonFixture(personOverrides)
  const moveFixture = generateMove(person.id, moveOptions, moveOverrides)
  const move = await moveService.create(moveFixture)
  move.person = person
  return move
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
async function selectOption({ options, value }) {
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
  } else {
    option = await options.nth(
      Math.floor(Math.random() * (await options.count))
    )
  }

  await t.click(option)
  return option.innerText
}

/**
 * Fill in an autocomplete field
 *
 * @param {object} [field]
 * @param {Selector} [field.selector] - A TestCafe selector
 * @param {string|number} [field.value] - Text value or index to select. If undefined, will select a random item
 *
 * @returns {string} - value of the selected item
 */
export async function fillAutocomplete({ selector, value }) {
  await t.click(selector)

  const optionsSelector = '.autocomplete__menu .autocomplete__option'
  const autocompleteMenuOptions = await selector.parent().find(optionsSelector)

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
export async function fillRadioOrCheckbox({ selector, value }) {
  const options = selector
    .parent('fieldset')
    .find('[type="radio"] ~ label, [type="checkbox"] ~ label')
  return selectOption({
    value,
    options,
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
export async function fillTextField({ selector, value }) {
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
export async function fillInForm(fields = []) {
  const filledInFields = {}

  for (const [key, field] of Object.entries(fields)) {
    switch (field.type) {
      case 'autocomplete':
        filledInFields[key] = await fillAutocomplete(field)
        break
      case 'radio':
        filledInFields[key] = await fillRadioOrCheckbox(field)
        break
      case 'checkbox':
        filledInFields[key] = await fillRadioOrCheckbox(field)
        break
      default:
        filledInFields[key] = await fillTextField(field)
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
  )}/Moves on*(Downloaded ${dateStamp}*.csv`
  return glob.sync(globPattern)
}

/**
 * Wait for the csvDownload path to exist. Handy when the files are downloading
 * @param delay
 * @returns {string[]}
 */
export async function waitForCsvDownloadFilePaths(delay = 500) {
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
      throw new Error(`Failed to delete CSV download file: ${err.message}`)
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
export function createLogger(baseUrl) {
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
  })
}

/**
 * Get logged response values for a url
 *
 * @param {string} url - URL to match
 *
 * @returns {object} - logger response object
 */
export function getLoggerResponse(logger, url) {
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
export function getResponseStatus(logger, url) {
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
export async function expectStatusCode(url, statusCode, negated = true) {
  const logger = createLogger(url)
  await t.addRequestHooks(logger)
  await t.navigateTo(url)
  const expectMethod = negated === false ? 'notOk' : 'ok'
  await t.expect(getResponseStatus(logger, url) === statusCode)[expectMethod]()
  await t.removeRequestHooks(logger)
}

/**
 * Check whether a url is protected
 *
 * @param {string} url - URL to check
 *
 * @param {boolean} [negated] - whether to negate the assertion
 *
 * @returns {Promise<boolean>}
 */
export async function expectForbidden(url, negated) {
  await expectStatusCode(url, 403, negated)
}
