import { Selector } from 'testcafe'

import { createPersonFixture } from '../../../_helpers'
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

fixture(
  'New move from Police Custody to Court with explicit special vehicle question'
).beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(newMove)
})

test('With special vehicle', async t => {
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
  const healthInformation: any = await createMovePage.fillInHealthInformation({
    fillInOptional: false,
    selectPregnant: false,
    selectWheelchair: false,
  })
  await page.submitForm()

  await createMovePage.requestSpecialVehicle()
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
  await moveDetailPage.checkHealthInformation(healthInformation, false)
})

fixture('Cancel move from Police Custody').beforeEach(async t => {
  const createdMove = createdMoves.shift()
  await t
    .useRole(policeUser)
    .navigateTo(createdMove!)
    .click(moveDetailPage.nodes.cancelLink as Selector)
})

test('Reason - `Supplier resource issue`', async t => {
  await cancelMovePage.selectReason('Supplier does not have the resource to fulfil this request')
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Supplier does not have the resource to fulfil this request',
  })
})
