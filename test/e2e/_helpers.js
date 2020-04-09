import { find, isArray, isNil } from 'lodash'
import { format } from 'date-fns'
import { join } from 'path'
import { homedir } from 'os'
import { ClientFunction, t } from 'testcafe'
import faker from 'faker'
import glob from 'glob'

import personService from '../../common/services/person'

export const scrollToTop = ClientFunction(() => {
  window.scrollTo(0, 0)
})

export function generatePerson(overrides = {}) {
  const firstNames = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    lastName,
    firstNames,
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

export async function createPersonFixture() {
  const fixture = generatePerson()
  const person = await personService.create({
    police_national_computer: fixture.policeNationalComputer,
    prison_number: fixture.prisonNumber,
    criminal_records_office: fixture.criminalRecordsOffice,
    niche_reference: fixture.nicheReference,
    athena_reference: fixture.athenaReference,
    last_name: fixture.lastName,
    first_names: fixture.firstNames,
    date_of_birth: fixture.dateOfBirth,
  })

  return {
    ...person,
    fullname: `${person.last_name}, ${person.first_names}`.toUpperCase(),
    lastName: person.last_name,
    firstNames: person.first_names,
    dateOfBirth: person.date_of_birth,
    prisonNumber: find(person.identifiers, {
      identifier_type: 'prison_number',
    }).value,
    policeNationalComputer: find(person.identifiers, {
      identifier_type: 'police_national_computer',
    }).value,
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
 * @param t
 * @param delay
 * @returns {string[]}
 */
export async function waitForCsvDownloadFilePaths(t, delay) {
  for (let i = 0; i < delay; i++) {
    await t.wait(200)

    const csvDownloadFilePaths = getCsvDownloadFilePaths()

    if (csvDownloadFilePaths.length) {
      return csvDownloadFilePaths
    }
  }
}
