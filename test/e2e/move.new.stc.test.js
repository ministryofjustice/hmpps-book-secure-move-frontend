import { Selector } from 'testcafe'

import { newMove } from './_routes'
import { stcUser } from './roles'
import { page, moveDetailPage, createMovePage } from './pages'

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
  const personalDetails = await createMovePage.fillInPersonalDetails()
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
