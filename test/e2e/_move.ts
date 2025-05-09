import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { createMoveFixture, fillInForm, expectStatusCode } from './_helpers'
import { getMove, getUpdateMove } from './_routes'
import { page, moveDetailPage, createMovePage } from './pages'
import { MoveDetailPage } from './pages/move-detail'

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
 * @returns {object} - created move object containing person data returned from createMoveFixture
 */
export async function createMove(options: any = {}) {
  if (
    !options.moveOverrides ||
    (options.moveOverrides &&
      !options.moveOverrides.from_location &&
      !options.moveOverrides.to_location)
  ) {
    await t
      .expect((page.nodes.locationMeta as Selector).getAttribute('content'))
      .ok('should contain a current location')

    const currentLocationId = await (
      page.nodes.locationMeta as Selector
    ).getAttribute('content')

    options.moveOverrides = {
      from_location: currentLocationId,
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

  await t.navigateTo(getMove(move.id))

  return move
}

type Options = {
  personOverrides?: {
    prisonNumber?: string
    criminalRecordsOffice?: string
    nicheReference?: string
    athenaReference?: string
    policeNationalComputer?: string
  }
  moveOverrides?: object
  moveOptions?: object
  defaultMoveOptions?: object
}

/**
 * Create a move to court
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
export function createCourtMove(options: Options = {}) {
  options.personOverrides = {
    prisonNumber: undefined,
    criminalRecordsOffice: undefined,
    nicheReference: undefined,
    athenaReference: undefined,
    ...options.personOverrides,
  }

  return createMove({
    defaultMoveOptions: {
      to_location_type: 'court',
      move_type: 'court_appearance',
    },
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
export function checkUpdateLink(page: string) {
  return moveDetailPage.checkUpdateLink(page)
}

/**
 * Check whether an update link for page is not present
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
export function checkNoUpdateLink(page: string) {
  return moveDetailPage.checkNoUpdateLink(page)
}

/**
 * Check whether an update link for page is not present
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
export function checkCancelLink() {
  return moveDetailPage.checkCancelLink()
}

/**
 * Check whether an update link for page is not present
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
export function checkNoCancelLink() {
  return moveDetailPage.checkCancelLink(false)
}

const updatePages = ['personal_details', 'risk', 'health', 'court', 'date']

/**
 * Filter update pages into
 *
 * @param {string} page - page key
 *
 * @returns {undefined}
 */
const filterUpdatePages = (
  pages = updatePages,
  exclude = false,
  drop: string[] = []
) => {
  let show = updatePages
    .filter(cat => !drop.includes(cat))
    .filter(cat => pages.includes(cat))
  let hide = updatePages
    .filter(cat => !drop.includes(cat))
    .filter(cat => !pages.includes(cat))

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
 * @param {string[]} drop - pages to drop from master list of pages
 *
 *
 * @returns {undefined}
 */
export async function checkUpdateLinks(
  pages: string[],
  exclude?: boolean,
  drop: string[] = []
) {
  const filteredPages = filterUpdatePages(pages, exclude, drop)

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
export async function checkUpdateLinksExcluding(pages: string[]) {
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
 * Check status of page for current user
 *
 * @param {string} page - page key
 *
 * @param {string} statusCode - status to check fot
 *
 * @returns {undefined}
 */
export async function checkUpdatePageStatus(page: string, statusCode: number) {
  const url = getUpdateMove(t.ctx.move.id, page)
  await expectStatusCode(url, statusCode)
}

/**
 * Check update pages are accessible to user - any not explicity mentioned
 *
 * @param {string[]} pages - list of page keys to check
 *
 * @param {boolean} [negated] - whether to negate the assertion
 *
 * @param {string[]} drop - pages to drop from master list of pages

 *
 * @returns {undefined}
 */
export async function checkUpdatePagesAccessible(
  pages: string[],
  negated?: boolean,
  drop: string[] = []
) {
  const filteredPages = filterUpdatePages(pages, negated, drop)

  for await (const page of filteredPages.show) {
    await checkUpdatePageStatus(page, 200)
  }

  for await (const page of filteredPages.hide) {
    await checkUpdatePageStatus(page, 404)
  }
}

/**
 * Check all update pages inaccessible to user
 *
 * @returns {undefined}
 */
export async function checkUpdatePagesForbidden() {
  for await (const page of updatePages) {
    await checkUpdatePageStatus(page, 403)
  }
}

/**
 * Check all update pages are redirect
 *
 * @returns {undefined}
 */
export async function checkUpdatePagesRedirected(
  _moveId: string,
  pages = updatePages
) {
  for await (const updatePage of pages) {
    const url = getUpdateMove(t.ctx.move.id, updatePage)

    await t
      .navigateTo(url)
      .expect(page.getCurrentUrl())
      .match(/\/move\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/warnings/)
  }
}

/**
 * Change personal details and confirm changes on move view page
 *
 * @param {object} options - same options as can be passed to updateMovePage.fillInPersonalDetails
 *
 * @returns {undefined}
 */
export async function checkUpdatePersonalDetails(options: object) {
  const { person } = t.ctx.move
  await moveDetailPage.clickUpdateLink('personal_details')
  await moveDetailPage.clickUpdateLink('edit_personal_details')

  const gender = person.gender === 'Female' ? 'Male' : 'Female'
  const updatedFields = await createMovePage.fillInPersonalDetails(
    { gender },
    options
  )
  const updatedDetails = { ...person, ...updatedFields }

  await createMovePage.submitForm()

  await t.navigateTo(getMove(t.ctx.move.id))
  await t.click(Selector('a').withExactText('Details'))
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
  page: string,
  fillInMethod: string,
  checkMethod: keyof MoveDetailPage,
  { selectAll = true, fillInOptional = true } = {}
) {
  const { profile } = t.ctx.move
  await moveDetailPage.clickUpdateLink(page)
  const updatedFields = await (createMovePage as any)[fillInMethod]({
    selectAll,
    fillInOptional,
  })
  const updatedDetails = { ...profile, ...updatedFields }

  await createMovePage.submitForm()

  await t.navigateTo(getMove(t.ctx.move.id))
  await t.click(Selector('a').withExactText('Details'))
  await (moveDetailPage[checkMethod] as (param: string) => {})(updatedDetails)
}

/**
 * Change risk information and confirm changes on move view page
 *
 * @param {object} [options] - same options as can be passed to updateMovePage.fillInRiskInformation
 *
 * @returns {undefined}
 */
export async function checkUpdateRiskInformation(options?: object) {
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
export async function checkUpdateHealthInformation(options?: object) {
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
export async function checkUpdateCourtInformation(options?: object) {
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
  await moveDetailPage.clickUpdateLink('move')

  const { moveType }: { moveType: string } = t.ctx.move

  const data: any = {}

  if (moveType === 'prison_recall') {
    data.additionalInformation = {
      selector: createMovePage.fields.prisonRecallComments,
      value: faker.lorem.sentence(6),
    }
  } else if (moveType === 'video_remand') {
    data.additionalInformation = {
      selector: createMovePage.fields.videoRemandComments,
      value: faker.lorem.sentence(6),
    }
  } else {
    const locationSelectors = {
      court_appearance: createMovePage.fields.courtLocation,
      prison_transfer: createMovePage.fields.prisonLocation,
      police_transfer: createMovePage.fields.policeLocation,
      hospital: createMovePage.fields.hospitalLocation,
      secure_childrens_home: createMovePage.fields.secureChildrensHomeLocation,
      secure_training_centre:
        createMovePage.fields.secureTrainingCentreLocation,
    }
    const selector =
      locationSelectors[moveType as keyof typeof locationSelectors] ||
      Selector(`#to_location_${moveType}`)
    data.toLocation = {
      selector,
      type: 'autocomplete',
    }
  }

  const fields = await fillInForm(data)
  const updatedMove: any = { moveType, ...fields }

  await createMovePage.submitForm()

  await moveDetailPage.checkMoveDetails(updatedMove)
}

/**
 * Change move date and confirm changes on move view page
 *
 * @returns {undefined}
 */
export async function checkUpdateMoveDate(date = 'Tomorrow') {
  await moveDetailPage.clickUpdateLink('date')

  const updatedMove = await createMovePage.fillInDate(date)

  await createMovePage.submitForm()

  await moveDetailPage.checkMoveDetails(updatedMove as any)
}

/**
 * Check that PNC details are uneditable and displayed corectly on the personal details page
 *
 * @returns {undefined}
 */
export async function checkPoliceNationalComputerReadOnly() {
  const { person } = t.ctx.move
  await moveDetailPage.clickUpdateLink('personal_details')
  await moveDetailPage.clickUpdateLink('edit_personal_details')

  const { policeNationalComputer, policeNationalComputerReadOnly } =
    createMovePage.fields

  const { policeNationalComputerHeading, policeNationalComputerValue } =
    createMovePage.nodes
  await t.expect(policeNationalComputer.exists).notOk()
  await t.expect(policeNationalComputerReadOnly.exists).ok()
  await t.expect((policeNationalComputerHeading as Selector).exists).ok()
  await t
    .expect((policeNationalComputerValue as Selector).innerText)
    .eql(person.policeNationalComputer)
}
