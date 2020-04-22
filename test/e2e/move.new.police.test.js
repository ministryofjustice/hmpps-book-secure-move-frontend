import { Selector } from 'testcafe'

import { generatePerson, createPersonFixture } from './_helpers'
import { policeUser } from './_roles'
import { newMove, movesByDay } from './_routes'
import {
  page,
  moveDetailPage,
  movesDashboardPage,
  cancelMovePage,
  createMovePage,
} from './pages'

fixture('New move from Police Custody to Court').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(newMove)
})

test('With unfound person', async t => {
  const person = await generatePerson()

  // PNC lookup
  await createMovePage.fillInPncSearch(person.policeNationalComputer)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(
    0,
    person.policeNationalComputer
  )
  await t.click(createMovePage.steps.personLookupResults.nodes.moveSomeoneNew)

  // Personal details
  // TODO: Check pnc number is pre-filled
  const personalDetails = await createMovePage.fillInPersonalDetails({
    policeNationalComputer: person.policeNationalComputer,
  })
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Court')
  await page.submitForm()

  // Fill in date
  await createMovePage.fillInDate()
  await page.submitForm()

  // Court information
  const courtInformation = await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  const riskInformation = await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  const healthInformation = await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.courtLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // Check assessment
  await moveDetailPage.checkCourtInformation(courtInformation)
  await moveDetailPage.checkRiskInformation(riskInformation)
  await moveDetailPage.checkHealthInformation(healthInformation)
})

test('With existing person', async t => {
  const personalDetails = await createPersonFixture()

  // PNC lookup
  await createMovePage.fillInPncSearch(personalDetails.policeNationalComputer)
  await page.submitForm()

  // PNC lookup results
  await createMovePage.checkPersonLookupResults(
    1,
    personalDetails.policeNationalComputer
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
  const courtInformation = await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  const riskInformation = await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  const healthInformation = await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.courtLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // Check assessment
  await moveDetailPage.checkCourtInformation(courtInformation)
  await moveDetailPage.checkRiskInformation(riskInformation)
  await moveDetailPage.checkHealthInformation(healthInformation)
})

fixture('New move from Police Custody to Prison (recall)').beforeEach(
  async t => {
    await t.useRole(policeUser).navigateTo(newMove)
  }
)

test('With a new person', async t => {
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
  const riskInformation = await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  const healthInformation = await createMovePage.fillInHealthInformation()
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

  // Check assessment
  await moveDetailPage.checkRiskInformation(riskInformation)
  await moveDetailPage.checkHealthInformation(healthInformation)
  await t
    .expect(moveDetailPage.nodes.courtInformationHeading.exists)
    .notOk()
    .expect(moveDetailPage.nodes.courtInformation.exists)
    .notOk()
})

fixture('Cancel move from Police Custody').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(movesByDay)
})

test('Reason - `Made in error`', async t => {
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

test('Reason - `Supplier declined to move this person`', async t => {
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

test('Reason - `Another reason`', async t => {
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
