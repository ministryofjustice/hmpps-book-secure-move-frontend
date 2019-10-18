import { ClientFunction, Selector, t } from 'testcafe'

/**
 * get inner text of resolved selector
 *
 * @param promise
 * @returns {string | Promise<string>}
 */
export const getInnerText = promise => promise.innerText

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
  optionTextOrIndex = 'random'
) {
  const optionsFieldset = await Selector('.govuk-fieldset__legend')
    .withText(legendText)
    .parent('.govuk-fieldset')

  const optionCssSelector = '.govuk-label'
  const optionSelector = Selector(optionsFieldset)
    .find(optionCssSelector)
    .withText(optionTextOrIndex)

  return selectOption(optionSelector, optionTextOrIndex, optionCssSelector)
}
