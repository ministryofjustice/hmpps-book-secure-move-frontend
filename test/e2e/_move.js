import faker from 'faker'
import { Selector, t } from 'testcafe'

import { createMoveFixture, expectForbidden, fillInForm } from './_helpers'
import { policeUser, stcUser } from './_roles'
import { home, getMove, getUpdateMove } from './_routes'
import { page, moveDetailPage } from './pages'
import UpdateMovePage from './pages/update-move'

/**
 * Create a move
 *
 * @param {object} options
 *
 * @param {Role} options.user - user to be able to view move with
 *
 * @param {object} [options.personOverrides] - override values for person
 *
 * @param {object} [options.moveOverrides] - override values for move
 *
 * @param {object} [options.moveOptions] - config for move creation
 * See createMoveFixture for more details
 *
 * @returns {undefined} Creates person and move, checking that move has all expected values
 */
export async function createMove(options = {}) {
  await t.useRole(options.user)

  if (
    !options.moveOverrides ||
    (options.moveOverrides && !options.moveOverrides.from_location)
  ) {
    await t.navigateTo(home)

    const currentUrl = await page.getCurrentUrl()
    const matched = currentUrl.match(
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/
    )
    if (!matched) {
      throw new Error('Could not determine current location')
    }
    const currentLocation = matched[0]
    t.ctx.from_location = currentLocation

    options.moveOverrides = {
      from_location: currentLocation,
      ...options.moveOverrides,
    }
  }

  if (options.defaultMoveOptions) {
    options.moveOptions = {
      ...options.defaultMoveOptions,
      ...options.moveOptions,
    }
  }

  const move = await createMoveFixture(options)
  t.ctx.move = move
  const { person } = move
  t.ctx.person = person
  await t.navigateTo(getMove(move.id))

  // double check that all move and person data is as expected
  await moveDetailPage.checkPersonalDetails(person)
  await moveDetailPage.checkRiskInformation(person)
  await moveDetailPage.checkHealthInformation(person)
  if (move.moveType !== 'prison_recall') {
    await moveDetailPage.checkCourtInformation(person)
  }
  await moveDetailPage.checkMoveDetails(move)
}

/**
 * Create a move as a police user
 *
 * @param {object} options
 *
 * @param {object} [options.personOverrides] - override values for person
 *
 * @param {object} [options.moveOverrides] - override values for move
 *
 * @param {object} [options.moveOptions] - config for move creation
 * See createMoveFixture for more details
 *
 * @returns {undefined} Creates person and move, checking that move has all expected values
 */
export async function createPoliceMove(options = {}) {
  options.personOverrides = {
    prisonNumber: undefined,
    criminalRecordsOffice: undefined,
    nicheReference: undefined,
    athenaReference: undefined,
    ...options.personOverrides,
  }

  return createMove({
    user: policeUser,
    defaultMoveOptions: {
      to_location_type: 'court',
      move_type: 'court_appearance',
    },
    ...options,
  })
}

/**
 * Create a move as a stc user
 *
 * @param {object} options
 *
 * @param {object} [options.personOverrides] - override values for person
 *
 * @param {object} [options.moveOverrides] - override values for move
 *
 * @param {object} [options.moveOptions] - config for move creation
 * See createMoveFixture for more details
 *
 * @returns {undefined} Creates person and move, checking that move has all expected values
 */
export async function createStcMove(options) {
  return createMove({
    user: stcUser,
    ...options,
  })
}

/**
 * Check whether an update link for page is present
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
export async function checkUpdateLink(page) {
  return moveDetailPage.checkUpdateLink(page)
}

/**
 * Check whether an update link for page is not present
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
export async function checkNoUpdateLink(page) {
  return moveDetailPage.checkNoUpdateLink(page)
}

const updatePages = ['personal_details', 'risk', 'health', 'court', 'date']

/**
 * Filter update pages into
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
const filterUpdatePages = (pages = updatePages, exclude = false) => {
  let show = updatePages.filter(cat => pages.includes(cat))
  let hide = updatePages.filter(cat => !pages.includes(cat))

  if (exclude) {
    ;[show, hide] = [hide, show]
  }
  return {
    show,
    hide,
  }
}

/**
 * Check for presence of update links on page - any not listed are explicitly expected to not be present
 *
 * @param {string[]} pages - explicit pages to check
 *
 * @param {boolean} [exclude] - whether to use list of pages as a blacklist rather than whitelist
 *
 * @returns {undefined}
 */
export async function checkUpdateLinks(pages, exclude) {
  const filteredPages = filterUpdatePages(pages, exclude)

  for await (const cat of filteredPages.show) {
    await checkUpdateLink(cat)
  }
  for await (const cat of filteredPages.hide) {
    await checkNoUpdateLink(cat)
  }
}

/**
 * Check for presence of all update links on page except for those explicitly listed
 *
 * @param {string[]} pages - explicit pages to check for absence
 *
 * @returns {undefined}
 */
export async function checkUpdateLinksExcluding(pages) {
  await checkUpdateLinks(pages, true)
}

/**
 * Check for absence of all update links on page
 *
 * @returns {undefined}
 */
export async function checkNoUpdateLinks() {
  await checkUpdateLinks([])
}

/**
 * Check whether current user is forbidden from accessing update page
 *
 * @param {string} page - page key
 *
 * @param {boolean} [negated] - whether to negate the assertion
 *
 * @returns {undefined}
 */
export async function checkUpdatePageForbidden(page, negated) {
  const url = getUpdateMove(t.ctx.move.id, page)
  await expectForbidden(url, negated)
}

/**
 * Check update pages are accessible to user - any not explicity mentioned
 *
 * @param {string[]} pages - list of page keys to check
 *
 * @param {boolean} [negated] - whether to negate the assertion
 *
 * @returns {undefined}
 */
export async function checkUpdatePagesAccessible(pages, negated) {
  const filteredPages = filterUpdatePages(pages, negated)

  for await (const page of filteredPages.show) {
    await checkUpdatePageForbidden(page, false)
  }
  for await (const page of filteredPages.hide) {
    await checkUpdatePageForbidden(page)
  }
}

/**
 * Check all update pages inaccessible to user
 *
 * @returns {undefined}
 */
export async function checkUpdatePagesForbidden() {
  await checkUpdatePagesAccessible([])
}

/**
 * Click link to update page
 *
 * @param {string} page - page key
 *
 * @returns {updateMovePage} - UpdateMovePage instance
 */
export async function clickUpdateLink(page) {
  const { move } = t.ctx

  await moveDetailPage.clickUpdateLink(page)
  return new UpdateMovePage(move.id)
}

/**
 * Change personal details and confirm changes on move view page
 *
 * @param {object} options - same options as can be passed to updateMovePage.fillInPersonalDetails
 *
 * @returns {undefined}
 */
export async function checkUpdatePersonalDetails(options) {
  const { person } = t.ctx
  const updateMovePage = await clickUpdateLink('personal_details')
  const gender = person.gender === 'Female' ? 'Male' : 'Female'
  const updatedFields = await updateMovePage.fillInPersonalDetails(
    { gender },
    options
  )
  const updatedDetails = { ...person, ...updatedFields }

  await updateMovePage.submitForm()

  await moveDetailPage.checkPersonalDetails(updatedDetails)
}

/**
 * Helper function change info on assessment answers page and confirm changes on move view page
 *
 * @param {string} page - page key
 *
 * @param {string} fillInMethod - updateMovePage method to use to fill in fields
 *
 * @param {string} checkMethod - updateMovePage method to use to check values
 *
 * @param {object} [options] - same options as can be passed to updateMovePage.fillInRiskInformation
 *
 * @param {boolean} [options.selectAll=true]
 *
 * @param {boolean} [options.fillInOptional=true]
 *
 * @returns {undefined}
 */
export async function checkUpdatePage(
  page,
  fillInMethod,
  checkMethod,
  { selectAll = true, fillInOptional = true } = {}
) {
  const { person } = t.ctx
  const updateMovePage = await clickUpdateLink(page)
  const updatedFields = await updateMovePage[fillInMethod]({
    selectAll,
    fillInOptional,
  })
  const updatedDetails = { ...person, ...updatedFields }

  await updateMovePage.submitForm()

  await moveDetailPage[checkMethod](updatedDetails)
}

/**
 * Change risk information and confirm changes on move view page
 *
 * @param {object} [options] - same options as can be passed to updateMovePage.fillInRiskInformation
 *
 * @returns {undefined}
 */
export async function checkUpdateRiskInformation(options) {
  await checkUpdatePage(
    'risk',
    'fillInRiskInformation',
    'checkRiskInformation',
    options
  )
}

/**
 * Change health information and confirm changes on move view page
 *
 * @param {object} [options] - same options as can be passed to updateMovePage.fillInHealthInformation
 *
 * @returns {undefined}
 */
export async function checkUpdateHealthInformation(options) {
  await checkUpdatePage(
    'health',
    'fillInHealthInformation',
    'checkHealthInformation',
    options
  )
}

/**
 * Change court information and confirm changes on move view page
 *
 * @param {object} [options] - same options as can be passed to updateMovePage.fillInCourtInformation
 *
 * @returns {undefined}
 */
export async function checkUpdateCourtInformation(options) {
  await checkUpdatePage(
    'court',
    'fillInCourtInformation',
    'checkCourtInformation',
    options
  )
}

/**
 * Change move details and confirm changes on move view page
 *
 * @returns {undefined}
 */
export async function checkUpdateMoveDetails() {
  const updateMovePage = await clickUpdateLink('move')

  const { moveType } = t.ctx.move

  const data = {}
  if (moveType === 'prison_recall') {
    data.additionalInformation = {
      selector: updateMovePage.fields.prisonRecallComments,
      value: faker.lorem.sentence(6),
    }
  } else {
    const locationSelectors = {
      court_appearance: updateMovePage.fields.courtLocation,
      prison_transfer: updateMovePage.fields.prisonLocation,
    }
    const selector =
      locationSelectors[moveType] || Selector(`#to_location_${moveType}`)
    data.toLocation = {
      selector,
      type: 'autocomplete',
    }
  }

  const fields = await fillInForm(data)
  const updatedMove = { moveType, ...fields }

  await updateMovePage.submitForm()

  await moveDetailPage.checkMoveDetails(updatedMove)
}

/**
 * Change move date and confirm changes on move view page
 *
 * @returns {undefined}
 */
export async function checkUpdateMoveDate(date = 'Tomorrow') {
  const updateMovePage = await clickUpdateLink('date')

  const updatedMove = await updateMovePage.fillInDate(date)

  await updateMovePage.submitForm()

  await moveDetailPage.checkMoveDetails(updatedMove)
}

/**
 * Check that PNC details are uneditable and displayed corectly on the personal details page
 *
 * @returns {undefined}
 */
export async function checkPoliceNationalComputerReadOnly() {
  const { person } = t.ctx
  const personalDetailsPage = await clickUpdateLink('personal_details')

  const {
    policeNationalComputer,
    policeNationalComputerReadOnly,
  } = personalDetailsPage.fields

  const {
    policeNationalComputerHeading,
    policeNationalComputerValue,
  } = personalDetailsPage.nodes
  await t.expect(policeNationalComputer.exists).notOk()
  await t.expect(policeNationalComputerReadOnly.exists).ok()
  await t.expect(policeNationalComputerHeading.exists).ok()
  await t
    .expect(policeNationalComputerValue.innerText)
    .eql(person.policeNationalComputer)
}
