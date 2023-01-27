import { Selector } from 'testcafe'

import { policeUser } from '../../../_roles'
import { newMove } from '../../../_routes'
import {
  page,
  moveDetailPage,
  createMovePage,
  cancelMovePage,
} from '../../../pages'

const createdMoves = []

const registerMoveUrl = async () => {
  const currentUrl = await page.getCurrentUrl()
  createdMoves.push(currentUrl)
}

fixture('New move from Police Custody to Prison (recall)').beforeEach(
  async t => {
    await t.useRole(policeUser).navigateTo(newMove)
  }
)

test('With a new person', async t => {
  // PNC lookup
  await t
    .expect(page.getCurrentUrl())
    .contains('/person-lookup-pnc')
    .click(createMovePage.steps.personLookup.nodes.noIdentifierLink)
    .click(createMovePage.steps.personLookup.nodes.moveSomeoneNew)

  // Personal details
  const personalDetails = await createMovePage.fillInPersonalDetails()
  await page.submitForm()

  // Move details
  await createMovePage.fillInMoveDetails('Prison recall')
  await page.submitForm()

  // Recall info
  await createMovePage.fillInRecallInfo()
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

  await registerMoveUrl()

  await t.click(Selector('a').withExactText('Details'))

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
  const createdMove = createdMoves.shift()
  await t
    .useRole(policeUser)
    .navigateTo(createdMove)
    .click(moveDetailPage.nodes.cancelLink)
})

test('Reason - `Cancelled by PMU`', async t => {
  await cancelMovePage.selectReason(
    'Cancelled by Population Management Unit (PMU)',
    'No free space'
  )
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content:
      'Reason — Cancelled by Population Management Unit (PMU) — No free space',
  })
})
