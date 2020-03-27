import { find } from 'lodash'
import { format } from 'date-fns'
import { join } from 'path'
import { homedir } from 'os'
import { ClientFunction, Selector, t } from 'testcafe'
import faker from 'faker'
import glob from 'glob'

import personService from '../../common/services/person'

/**
 * Get inner text of TestCafe selector
 *
 * @param {Selector} selector - TestCafe selector
 * @returns {Promise<string>} - element inner text
 */
export const getInnerText = selector => selector.innerText

export const scrollToTop = ClientFunction(() => {
  window.scrollTo(0, 0)
})

/**
 * Select option from selector
 *
 * @param {Selector} selector
 * @param {string|number} [textOrIndex='random'] - option text or 0-based index or 'random'
 * @param {string} [cssSelector] - CSS selector to pass to ClientFunction. Required when picking a random option
 * @returns {Selector}
 */
async function selectOption(selector, textOrIndex = 'random', cssSelector) {
  let option
  if (typeof textOrIndex === 'string' && textOrIndex !== 'random') {
    option = selector.withText(textOrIndex)
  } else if (typeof textOrIndex === 'number') {
    option = selector.nth(textOrIndex)
  } else {
    const randomIndex = await ClientFunction(
      () => {
        if (!cssSelector) {
          return 0
        }
        return Math.floor(
          Math.random() * document.querySelectorAll(cssSelector).length
        )
      },
      { dependencies: { cssSelector } }
    )()
    option = selector.nth(randomIndex)
  }

  await t.click(option)

  return option
}

export function generatePerson({ pncNumber } = {}) {
  return {
    police_national_computer:
      pncNumber ||
      faker
        .fake('{{random.alphaNumeric(6)}}/{{random.alphaNumeric(2)}}')
        .toUpperCase(),
    prison_number: faker.fake(
      '{{helpers.replaceSymbols("?")}}{{random.number}}{{helpers.replaceSymbols("??")}}'
    ),
    last_name: faker.name.lastName(),
    first_names: faker.name.firstName(),
    date_of_birth: format(
      faker.date.between('01-01-1940', '01-01-1990'),
      'yyyy-MM-dd'
    ),
  }
}

export async function createPersonFixture() {
  const person = await personService.create(generatePerson())

  return {
    ...person,
    fullname: `${person.last_name}, ${person.first_names}`.toUpperCase(),
    prison_number: find(person.identifiers, {
      identifier_type: 'prison_number',
    }).value,
    police_national_computer: find(person.identifiers, {
      identifier_type: 'police_national_computer',
    }).value,
  }
}

/**
 * Select random option from autocomplete menu
 *
 * @param {Selector} selector - An autocomplete field
 * @param {string|number} [optionTextOrIndex] - option text or 0-based index or 'random'.
 * @returns {string} - selected value
 */
export async function selectAutocompleteOption(selector, optionTextOrIndex) {
  await t.click(selector)

  const optionsSelector = '.autocomplete__menu .autocomplete__option'
  const autocompleteMenuOptions = await selector.parent().find(optionsSelector)

  return selectOption(
    autocompleteMenuOptions,
    optionTextOrIndex,
    optionsSelector
  ).then(getInnerText)
}

/**
 * Get a checked option input element
 *
 * @param legendText
 * @returns {Promise<*>}
 */
export async function getSelectedFieldsetOption(legendText) {
  const optionsFieldset = await Selector('.govuk-fieldset__legend')
    .withText(legendText)
    .parent('.govuk-fieldset')

  return Selector(optionsFieldset)
    .find('.govuk-radios__input')
    .withAttribute('checked')
}

/**
 * Select option (radio or checkbox)
 *
 * @param {string} legendText - legend text for the fieldset
 * @param {string|number} [optionLabelTextOrIndex] - option text or 0-based index or 'random'.
 * @returns {Selector}
 */
export async function selectFieldsetOption(
  legendText,
  optionLabelTextOrIndex = 'random'
) {
  const optionsFieldset = await Selector('.govuk-fieldset__legend')
    .withText(legendText)
    .parent('.govuk-fieldset')

  const optionCssSelector = '.govuk-label'
  const optionSelector = Selector(optionsFieldset)
    .find(optionCssSelector)
    .withText(optionLabelTextOrIndex)

  return selectOption(optionSelector, optionLabelTextOrIndex, optionCssSelector)
}

/**
 * Fill in form details on page
 *
 * @param {FormDetails} details - text fields and select options objects with field IDs as properties
 * @returns {Promise<textFields>} - details used to fill the form
 */
export async function fillInForm(fields = {}) {
  const filledInFields = {}

  for (const [id, value] of Object.entries(fields)) {
    const textInputSelector = `#${id}`
    const exists = await Selector(textInputSelector).exists

    if (exists) {
      await t
        .selectText(textInputSelector)
        .pressKey('delete')
        .typeText(textInputSelector, value)

      filledInFields[id] = value
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
 * Click selector if it exists on page
 *
 * @param selector
 * @returns {Promise<void>}
 */
export async function clickSelectorIfExists(selector) {
  if (await selector.exists) {
    await t.click(selector)
  }
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

/**
 * Form details object
 *
 * @typedef {object} FormDetails
 * @property {TextFields} [text] - text fields values with field IDs as keys
 * @property {SelectFields} [options] - option field values with field IDs as keys
 */

/**
 * Form details text fields
 *
 * @typedef {Object.<string, string>} TextFields
 */

/**
 * Form details select fields
 *
 * @typedef {Object.<string, string>} SelectFields
 */
