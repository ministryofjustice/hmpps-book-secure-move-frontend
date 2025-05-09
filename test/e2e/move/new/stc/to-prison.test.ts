import { Selector } from 'testcafe'

import { stcUser } from '../../../_roles'
import { newMove } from '../../../_routes'
import { page, moveDetailPage, createMovePage } from '../../../pages'

fixture('New move from Secure Training Centre (STC) to Prison').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(newMove)
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
  const moveDetails = await createMovePage.fillInMoveDetails('Prison')
  await page.submitForm()

  // Move date
  await createMovePage.fillInDateRange()
  await page.submitForm()

  // Transfer reason
  await createMovePage.fillInPrisonTransferReasons()
  await page.submitForm()

  // Agreement status
  await createMovePage.fillInAgreementStatus()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.prisonLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  await t.click(Selector('a').withExactText('Details'))

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // Check banner
  await t
    .expect((moveDetailPage.nodes.instructionBanner as Selector).innerText)
    .contains('Pending review', 'Should show that the move is pending a review')
    .expect((moveDetailPage.nodes.instructionBanner as Selector).innerText)
    .contains('Placement team', 'Should include the correct review team')
})
