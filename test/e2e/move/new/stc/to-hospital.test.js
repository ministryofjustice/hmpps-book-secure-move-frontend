import { Selector } from 'testcafe'

import { stcUser } from '../../../_roles'
import { newMove } from '../../../_routes'
import { page, moveDetailPage, createMovePage } from '../../../pages'

fixture('New move from Secure Training Centre (STC) to Hospital').beforeEach(
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
  const personalDetails = await createMovePage.fillInPersonalDetails()
  await page.submitForm()

  // Move details
  const moveDetails = await createMovePage.fillInMoveDetails('Hospital')
  await page.submitForm()

  // Move date
  await createMovePage.fillInDate()
  await page.submitForm()

  // Transfer reason
  await createMovePage.fillInHospitalDetails()
  await page.submitForm()

  // Confirmation page
  await createMovePage.checkConfirmationStep({
    fullname: personalDetails.fullname,
    location: moveDetails.hospitalLocation,
  })
  await t.click(Selector('a').withExactText(personalDetails.fullname))

  await t.click(Selector('a').withExactText('Details'))

  // Move detail assertions
  await moveDetailPage.checkHeader({ fullname: personalDetails.fullname })

  // Personal details assertions
  await moveDetailPage.checkPersonalDetails(personalDetails)

  // Check banner
  await t
    .expect(moveDetailPage.nodes.identityBar.innerText)
    .contains(
      'Start Youth Risk Assessment',
      'Should contain start assessment banner'
    )
})
