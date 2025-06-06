import { Selector, ClientFunction } from 'testcafe'

import { generatePerson, createPersonFixture } from '../../../_helpers'
import { policeUser } from '../../../_roles'
import { newMove } from '../../../_routes'
import {
  page,
  moveDetailPage,
  createMovePage,
  cancelMovePage,
} from '../../../pages'

const createdMoves: string[] = []

const registerMoveUrl = async () => {
  const currentUrl = await page.getCurrentUrl()
  createdMoves.push(currentUrl)
}

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
  const personalDetails: any = await createMovePage.fillInPersonalDetails({
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
  const courtInformation: any = await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  const riskInformation: any = await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  const healthInformation: any = await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.courtLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  await registerMoveUrl()

  await t.click(Selector('a').withExactText('Details'))

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
  const courtInformation: any = await createMovePage.fillInCourtInformation()
  await page.submitForm()

  // Risk information
  const riskInformation: any = await createMovePage.fillInRiskInformation()
  await page.submitForm()

  // Health information
  const healthInformation: any = await createMovePage.fillInHealthInformation()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.courtLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  await registerMoveUrl()

  await t.click(Selector('a').withExactText('Details'))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // Check assessment
  await moveDetailPage.checkCourtInformation(courtInformation)
  await moveDetailPage.checkRiskInformation(riskInformation)
  await moveDetailPage.checkHealthInformation(healthInformation)
})

fixture('Cancel move from Police Custody').beforeEach(async t => {
  const createdMove = createdMoves.shift()
  await t
    .useRole(policeUser)
    .navigateTo(createdMove!)
    .click(moveDetailPage.nodes.cancelLink as Selector)
})

test('Reason - `Supplier declined to move this person`', async t => {
  await cancelMovePage.selectReason('Prisoner refusal')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Prisoner refusal',
  })

  // Check that navigating back doesn't produce journey error
  const goBack = ClientFunction(() => window.history.back())
  await goBack()

  await t
    .expect(moveDetailPage.getCurrentUrl())
    .notContains('/cancel/reason', 'Should not show journey expired page')
})

test('Reason - `Another reason`', async t => {
  await cancelMovePage.selectReason('Population Management Unit (PMU) cancelled request', 'Locking down sending prison')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Locking down sending prison',
  })
})
