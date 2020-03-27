import { Selector } from 'testcafe'

import { newMove, movesByDay } from './_routes'
import { policeUser } from './roles'
import {
  page,
  moveDetailPage,
  movesDashboardPage,
  cancelMovePage,
  createMovePage,
} from './pages'
import { generatePerson, createPersonFixture } from './helpers'

fixture('New move from Police Custody').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(newMove)
})

test('Police to Court with unfound person', async t => {
  const person = generatePerson()

  // PNC lookup
  await createMovePage.fillInPncSearch(person.police_national_computer)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(
    0,
    person.police_national_computer
  )
  await t.click(createMovePage.steps.personLookupResults.nodes.moveSomeoneNew)

  // Personal details
  // TODO: Check pnc number is pre-filled
  const personalDetails = await createMovePage.fillInPersonalDetails({
    pncNumber: person.police_national_computer,
  })
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Fill in date
  await createMovePage.fillInDate()
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
    fullname: personalDetails.fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)
})

test('Police to Court with existing person', async t => {
  const personalDetails = await createPersonFixture()

  // PNC lookup
  await createMovePage.fillInPncSearch(personalDetails.police_national_computer)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(
    1,
    personalDetails.police_national_computer
  )
  await createMovePage.selectSearchResults(personalDetails.fullname)
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Fill in date
  await createMovePage.fillInDate()
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
    fullname: personalDetails.fullname,
    location: moveDetails.to_location_court_appearance,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

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
  const personalDetails = await createMovePage.fillInPersonalDetails()
  await page.submitForm()

  // Move details
  await createMovePage.fillInMoveDetails('Prison recall')
  await page.submitForm()

  // Fill in date
  await createMovePage.fillInDate()
  await page.submitForm()

  // Risk information
  await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: 'Prison',
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

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
