import { Selector } from 'testcafe'

import { FEATURE_FLAGS } from '../../../../../config'
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
  const personalDetails: any = await createMovePage.fillInPersonalDetails()
  await page.submitForm()

  // Move details
  await createMovePage.fillInMoveDetails('Prison recall')
  await page.submitForm()

  // TODO: find a way to test feature flags properly
  if (FEATURE_FLAGS.DATE_OF_ARREST) {
    // Recall info
    await createMovePage.fillInRecallInfo()
    await page.submitForm()
  }

  // Fill in date
  await createMovePage.fillInDate()
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
    .expect((moveDetailPage.nodes.courtInformationHeading as Selector).exists)
    .notOk()
    .expect((moveDetailPage.nodes.courtInformation as Selector).exists)
    .notOk()
})

fixture('Cancel move from Police Custody').beforeEach(async t => {
  const createdMove = createdMoves.shift()
  await t
    .useRole(policeUser)
    .navigateTo(createdMove!)
    .click(moveDetailPage.nodes.cancelLink as Selector)
})

test('Reason - `Police transported the prisoner`', async t => {
  await cancelMovePage.selectReason(
    'Efficiency: move combined with another request'
  )
  await page.submitForm()

  await moveDetailPage.checkBanner({
    heading: 'Move cancelled',
    content: 'Reason — Police transported the prisoner',
  })
})
