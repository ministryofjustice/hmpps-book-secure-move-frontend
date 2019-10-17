import { policeUser } from './roles'
import Page from './page-model'

const page = new Page()

fixture`Create a new move`

test('Court move', async t => {
  await t
    .useRole(policeUser)
    .navigateTo(page.locations.home)
    .click(page.nodes.createMoveButton)

  // Personal details
  // eslint-disable-next-line
  const personalDetailsInputs = await page.fillInPersonalDetails()

  await t.click(page.nodes.continueButton)

  // Where is this person moving?
  await page.selectRadio('Move to', 'Court')

  const selectedCourt = await page.selectRandomOptionFromAutocomplete(
    'Name of court'
  )
  const selectedDate = await page.selectRadio('Date', 'Today')

  // eslint-disable-next-line
  const moveDetailsInputs = {
    court: await selectedCourt.innerText,
    date: await selectedDate.innerText,
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
})

test('Prison recall', async t => {})

test('Check conditional content', async t => {})

fixture`Cancel move`

test('Cancel existing move', async t => {})
