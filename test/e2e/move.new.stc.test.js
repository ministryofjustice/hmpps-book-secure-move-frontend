import { Selector } from 'testcafe'

import { stcUser } from './_roles'
import { newMove } from './_routes'
import { page, moveDetailPage, createMovePage } from './pages'

fixture('New move from Secure Training Centre (STC) to Court').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(newMove)
  }
)

test.meta('hasDocument', 'true')('With a new person', async t => {
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

  // Move date
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

  // Documents upload
  const files = ['a-random-text-file.txt', 'boy-the-cat.jpg', 'leo-the-cat.png']
  await createMovePage.fillInDocumentUploads(files)
  await createMovePage.checkDocumentUploads(files)
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

  // TODO: Check files are present
})
