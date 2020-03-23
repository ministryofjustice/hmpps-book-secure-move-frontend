import { Selector } from 'testcafe'
import faker from 'faker'

import { newMove, movesByDay } from './_routes'
import { policeUser, stcUser } from './roles'
import {
  page,
  moveDetailPage,
  movesDashboardPage,
  cancelMovePage,
  createMovePage,
} from './pages'

const pncNumber = faker.random.number().toString()
let personalDetails
let fullname

fixture('New move from Police Custody').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(newMove)
})

test('Police to Court with unfound person', async t => {
  // PNC lookup
  await createMovePage.fillInPncSearch(pncNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(0, pncNumber)
  await t.click(createMovePage.steps.personLookupResults.nodes.moveSomeoneNew)

  // Personal details
  // TODO: Check pnc number is pre-filled
  personalDetails = await createMovePage.fillInPersonalDetails({
    pncNumber,
  })
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Court information
  await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  fullname = `${personalDetails.text.last_name}, ${personalDetails.text.first_names}`.toUpperCase()

  await createMovePage.checkConfirmationStep({
    fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})

test('Police to Court with existing person', async t => {
  // PNC lookup
  await createMovePage.fillInPncSearch(pncNumber)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(1, pncNumber)
  await createMovePage.selectSearchResults(fullname)
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Court information
  await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})

test('Police to Prison (recall) with new person', async t => {
  // PNC lookup
  await t
    .expect(page.getCurrentUrl())
    .contains('/move/new/person-lookup-pnc')
    .click(createMovePage.steps.personLookup.nodes.noIdentifierLink)
    .click(createMovePage.steps.personLookup.nodes.moveSomeoneNew)

  // Personal details
  const personalDetails = await createMovePage.fillInPersonalDetails({
    pncNumber,
  })
  await page.submitForm()

  // Move details
  await createMovePage.fillInMoveDetails('Prison recall')
  await page.submitForm()

  // Risk information
  await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  const fullname = `${personalDetails.text.last_name}, ${personalDetails.text.first_names}`.toUpperCase()

  await createMovePage.checkConfirmationStep({
    fullname,
    location: 'Prison',
  })
  await t.click(Selector('a').withExactText(fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})

fixture('Cancel move from Police Custody').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(movesByDay)
})

test('Cancel move `Made in error`', async t => {
  await t
    .click(movesDashboardPage.nodes.movesLinks.nth(0))
    .click(moveDetailPage.nodes.cancelLink)

  await cancelMovePage.selectReason('Made in error')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Made in error',
  })
})

test('Cancel move `Supplier declined to move this person`', async t => {
  await t
    .click(movesDashboardPage.nodes.movesLinks.nth(0))
    .click(moveDetailPage.nodes.cancelLink)

  await cancelMovePage.selectReason('Supplier declined to move this person')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Supplier declined to move this person',
  })
})

test('Cancel move `Another reason`', async t => {
  await t
    .click(movesDashboardPage.nodes.movesLinks.nth(0))
    .click(moveDetailPage.nodes.cancelLink)

  await cancelMovePage.selectReason('Another reason', 'Flat tyre on the van')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Flat tyre on the van',
  })
})

fixture('New move from Secure Training Centre (STC)').beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(newMove)
})

test('Secure Training Centre to Court with new person', async t => {
  // PNC lookup
  await t
    .expect(page.getCurrentUrl())
    .contains('/move/new/person-lookup-pnc')
    .click(createMovePage.steps.personLookup.nodes.noIdentifierLink)
    .click(createMovePage.steps.personLookup.nodes.moveSomeoneNew)

  // Personal details
  const personalDetails = await createMovePage.fillInPersonalDetails({
    pncNumber,
  })
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Court information
  await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Documents upload
  const files = ['a-random-text-file.txt', 'boy-the-cat.jpg', 'leo-the-cat.png']
  await createMovePage.fillInDocumentUploads(files)
  await createMovePage.checkDocumentUploads(files)
  await page.submitForm()

  // Confirmation page
  const fullname = `${personalDetails.text.last_name}, ${personalDetails.text.first_names}`.toUpperCase()

  await createMovePage.checkConfirmationStep({
    fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // TODO: Check files are present
})
