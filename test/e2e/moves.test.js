import { unlinkSync, readFileSync } from 'fs'
import { policeUser, supplierUser } from './roles'
import Page from './page-model'
import {
  selectFieldsetOption,
  scrollToTop,
  getCsvDownloadsFilePaths,
  clickSelectorIfExists,
  checkFileExists,
} from './helpers'

const page = new Page()

fixture`Create a new move`

test('Court move', async t => {
  await t.useRole(policeUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t
    .click(page.nodes.createMoveButton)
    .expect(page.nodes.pageHeading.innerText)
    .eql('Personal details')

  const personalDetails = await page.fillInPersonalDetails()
  await t.click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Where is this person moving?')
  await page.fillInMoveDetails('Court')
  await t.click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Is there information for the court?')
    .click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Are there risks with moving this person?')
    .click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Does this person’s health affect transport?')
    .click(page.nodes.scheduleMoveButton)

  const referenceNumber = await page.getMoveConfirmationReferenceNumber()

  await t.navigateTo(page.locations.home)

  const scheduledListItem = await page.getMoveListItemByReference(
    referenceNumber
  )

  await t
    .expect(scheduledListItem.find('.app-card__title').innerText)
    .eql(
      `${personalDetails.text.last_name}, ${personalDetails.text.first_names}`.toUpperCase()
    )

  await t.click(scheduledListItem.find('.app-card__link'))

  await t
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'PNC number'
      )
    )
    .eql(personalDetails.text.police_national_computer)
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'Gender'
      )
    )
    .eql(personalDetails.options.gender)
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'Ethnicity'
      )
    )
    .eql(personalDetails.options.ethnicity)
})

test('Prison recall', async t => {
  await t.useRole(policeUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t
    .click(page.nodes.createMoveButton)
    .expect(page.nodes.pageHeading.innerText)
    .eql('Personal details')
  const personalDetails = await page.fillInPersonalDetails()
  await t.click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Where is this person moving?')
  await page.fillInMoveDetails('Prison recall')
  await t.click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Are there risks with moving this person?')
    .click(page.nodes.continueButton)

  await t
    .expect(page.nodes.pageHeading.innerText)
    .eql('Does this person’s health affect transport?')
    .click(page.nodes.scheduleMoveButton)

  const referenceNumber = await page.getMoveConfirmationReferenceNumber()

  await t.navigateTo(page.locations.home)

  const scheduledListItem = await page.getMoveListItemByReference(
    referenceNumber
  )
  await t
    .expect(scheduledListItem.find('.app-card__title').innerText)
    .eql(
      `${personalDetails.text.last_name}, ${personalDetails.text.first_names}`.toUpperCase()
    )

  await t.click(scheduledListItem.find('.app-card__link'))

  await t
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'PNC number'
      )
    )
    .eql(personalDetails.text.police_national_computer)
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'Gender'
      )
    )
    .eql(personalDetails.options.gender)
    .expect(
      await page.getDlDefinitionByKey(
        page.nodes.personalDetailsSummary,
        'Ethnicity'
      )
    )
    .eql(personalDetails.options.ethnicity)
})

fixture`Cancel move`

test('Cancel existing move', async t => {
  await t.useRole(policeUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t.click('.app-card__link')

  const referenceNumber = await page.getMoveSummaryReferenceNumber()

  await t.click(page.nodes.cancelLink)
  await selectFieldsetOption(
    'Why are you cancelling this move request?',
    'Made in error'
  )
  await t
    .click(page.nodes.cancelMoveButton)
    .expect(page.nodes.messageHeading.innerText)
    .eql('Move cancelled')

  await t
    .navigateTo(page.locations.home)
    .expect(
      page.nodes.details
        .find('.app-card__caption')
        .withText(`Move reference: ${referenceNumber}`)
    )
    .ok()
})

fixture`Move details`

test('Navigate tags in detailed move', async t => {
  async function checkNavigationByTags(tags = []) {
    for (const tag of tags) {
      const blockBefore = await page.getElementScrollOffset(tag.id)
      await t.click(await page.getTagByLabel(tag.label))
      const blockAfter = await page.getElementScrollOffset(tag.id)

      await t.expect(blockAfter.top).lt(blockBefore.top)

      await scrollToTop()
    }
  }

  await t.useRole(policeUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t.click(page.nodes.createMoveButton)

  const personalDetails = await page.fillInPersonalDetails()
  await t.click(page.nodes.continueButton)

  await page.fillInMoveDetails('Prison recall')
  await t.click(page.nodes.continueButton)

  // Are there risks with moving this person?
  await selectFieldsetOption('Add risk information', 'Violent')
  await selectFieldsetOption('Add risk information', 'Escape')

  await t.click(page.nodes.continueButton)

  // Does this person’s health affect transport?
  await selectFieldsetOption('Add health information', 'Medication')

  await t
    .click(page.nodes.scheduleMoveButton)
    .click(
      await page.getPersonLink(
        personalDetails.text.first_names,
        personalDetails.text.last_name
      )
    )

  await checkNavigationByTags([
    { label: 'VIOLENT', id: '#violent' },
    { label: 'ESCAPE', id: '#escape' },
    { label: 'MEDICATION', id: '#medication' },
  ])
})

function deleteDownloads() {
  const csvDownloads = getCsvDownloadsFilePaths()
  for (const file of csvDownloads) {
    try {
      unlinkSync(file)
    } catch (err) {
      throw new Error(`failed to delete CSV download file: ${err.message}`)
    }
  }
}

fixture`Download moves`.beforeEach(deleteDownloads).after(deleteDownloads)

test('Download moves as police user', async t => {
  await t.useRole(policeUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t.click(page.nodes.downloadMovesLink)

  const csvDownloads = getCsvDownloadsFilePaths()

  await checkFileExists(t, 10, csvDownloads[0])

  try {
    const csvContents = readFileSync(csvDownloads[0], 'utf8')
    const contentsLines = csvContents.split('\n')
    const csvHeader = contentsLines[0].split(',')
    const csvFirstLine = contentsLines[1].split(',')

    await t.expect(csvHeader.length).eql(csvFirstLine.length)
  } catch (err) {
    throw new Error('Failed to read CSV download file')
  }
})

test('Download moves as supplier user', async t => {
  await t.useRole(supplierUser).navigateTo(page.locations.home)

  await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

  await t.click(page.nodes.downloadMovesLink)

  const csvDownloads = getCsvDownloadsFilePaths()

  await checkFileExists(t, 10, csvDownloads[0])

  try {
    const csvContents = readFileSync(csvDownloads[0], 'utf8')
    const contentsLines = csvContents.split('\n')
    const csvHeader = contentsLines[0].split(',')
    const csvFirstLine = contentsLines[1].split(',')

    await t.expect(csvHeader.length).eql(csvFirstLine.length)
  } catch (err) {
    throw new Error('Failed to read CSV download file')
  }
})
