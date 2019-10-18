/* eslint-disable no-console */
import faker from 'faker'
import { policeUser } from './roles'
import Page from './page-model'
import {
  selectFieldsetOption,
  selectAutocompleteOption,
  getInnerText,
} from './helpers'

const page = new Page()

fixture`Create a new move`

test('Court move', async t => {
  await t
    .useRole(policeUser)
    .navigateTo(page.locations.home)
    .click(page.nodes.createMoveButton)

  const personalDetails = {
    text: {
      police_national_computer: faker.random.number().toString(),
      last_name: faker.name.lastName(),
      first_names: faker.name.firstName(),
      date_of_birth: faker.date
        .between('01/01/1940', '01/01/1990')
        .toLocaleDateString(),
    },
    options: {
      ethnicity: await selectAutocompleteOption('Ethnicity').then(getInnerText),
      gender: await selectFieldsetOption(
        'Gender',
        faker.random.arrayElement(['Male', 'Female'])
      ).then(getInnerText),
    },
  }

  // Personal details
  await page.fillInForm(personalDetails)
  await t.click(page.nodes.continueButton)

  // Where is this person moving?
  await selectFieldsetOption('Move to', 'Court')

  const moveDetails = {
    options: {
      to_location_court_appearance: await selectAutocompleteOption(
        'Name of court'
      ).then(getInnerText),
      date_type: await selectFieldsetOption('Date', 'Today').then(getInnerText),
    },
  }

  await t.click(page.nodes.continueButton)

  // Is there information for the court?
  await t.click(page.nodes.continueButton)

  // Are there risks with moving this person?
  await t.click(page.nodes.continueButton)

  // Does this person’s health affect transport?
  await t.click(page.nodes.scheduleMoveButton)

  // Confirmation page
  await t.expect(page.nodes.confirmationTitle.exists).ok()

  console.log('Personal details:', personalDetails)
  console.log('Move details:', moveDetails)
})

test('Prison recall', async t => {})

test('Check conditional content', async t => {})

fixture`Cancel move`

test('Cancel existing move', async t => {})
