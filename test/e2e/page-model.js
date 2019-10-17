import dotenv from 'dotenv'
import faker from 'faker'
import { sample } from 'lodash'
import { Selector, ClientFunction, t } from 'testcafe'

dotenv.config()

const baseUrl = process.env.E2E_BASE_URL || `http://${process.env.SERVER_HOST}`

function getRandomItemBySelector(selector) {
  const optionCount = document.querySelectorAll(selector).length
  return Math.floor(Math.random() * optionCount) + 1
}

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
        'Police User'
      ),
      supplierUserName: Selector('.app-header__navigation-item').withExactText(
        'GEOAmey Supplier'
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
      confirmationTitle: Selector('.govuk-panel__title').withText(
        'Move scheduled'
      ),
    }
  }

  async selectRandomOptionFromAutocomplete(labelText) {
    const fieldSelector = Selector('.govuk-label').withText(labelText)

    await t.click(fieldSelector)

    const autocompleteMenu = await fieldSelector
      .sibling('span')
      .find('.autocomplete__menu')()

    const selector = `#${autocompleteMenu.id} .autocomplete__option`
    const randomOptionIndex = await ClientFunction(
      () => getRandomItemBySelector(selector),
      { dependencies: { selector, getRandomItemBySelector } }
    )()
    const randomOption = Selector(selector).nth(randomOptionIndex)

    await t.click(randomOption)

    return randomOption
  }

  async selectRadio(legendText, optionText) {
    const optionsFieldset = await Selector('.govuk-fieldset__legend')
      .withText(legendText)
      .parent('.govuk-fieldset')

    const option = Selector(optionsFieldset)
      .find('.govuk-label')
      .withText(optionText)

    await t.click(option)

    return option
  }

  async fillInPersonalDetails() {
    const gender = sample(['Male', 'Female'])
    const ethnicitySelection = await this.selectRandomOptionFromAutocomplete(
      'Ethnicity'
    )
    const genderSelection = await this.selectRadio('Gender', gender)

    const inputs = {
      text: {
        police_national_computer: faker.random.number().toString(),
        last_name: faker.name.lastName(),
        first_names: faker.name.firstName(),
        date_of_birth: faker.date
          .between('01/01/1940', '01/01/1990')
          .toLocaleDateString(),
      },
      radios: {
        ethnicity: await ethnicitySelection.innerText,
        gender: await genderSelection.innerText,
      },
    }

    for (const [id, value] of Object.entries(inputs.text)) {
      await t.typeText(`#${id}`, value)
    }

    return inputs
  }
}
