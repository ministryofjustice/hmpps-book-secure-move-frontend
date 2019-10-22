import { format } from 'date-fns'
import { join } from 'path'
import { homedir } from 'os'
import { ClientFunction, Selector, t } from 'testcafe'
import glob from 'glob'

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

/**
 * Select random option from autocomplete menu
 *
 * @param {string} labelText - label text for the option
 * @param {string|number} [optionTextOrIndex] - option text or 0-based index or 'random'.
 * @returns {Selector}
 */
export async function selectAutocompleteOption(labelText, optionTextOrIndex) {
  const fieldSelector = Selector('.govuk-label').withText(labelText)

  await t.click(fieldSelector)

  const optionCssSelector = '.autocomplete__menu .autocomplete__option'
  const autocompleteMenuOptions = await fieldSelector
    .sibling('span')
    .find(optionCssSelector)

  return selectOption(
    autocompleteMenuOptions,
    optionTextOrIndex,
    optionCssSelector
  )
}

/**
 * Select option (radio or checkbox)
 *
 * @param {string} legendText - legend text for the fieldset
 * @param {string|number} [optionTextOrIndex] - option text or 0-based index or 'random'.
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
 * @returns {Promise<FormDetails>} - details used to fill the form
 */
export async function fillInForm(details = {}) {
  const textFields = details.text || {}

  for (const [id, value] of Object.entries(textFields)) {
    await t.typeText(`#${id}`, value)
  }

  return details
}

/**
 * Get CSV files downloaded from the app today (glob pattern matched)
 *
 * @returns {string[]}
 */
export function getCsvDownloadsFilePaths() {
  const dateStamp = format(new Date(), 'yyyy-MM-dd')
  const globPattern = `${join(
    homedir(),
    'Downloads'
  )}/Moves on*(Downloaded ${dateStamp}*.csv`
  return glob.sync(globPattern)
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
