import { ClientFunction, Selector } from 'testcafe'

import frameworksService from '../../common/services/frameworks'

import { fillInPersonEscortRecord } from './_helpers'
import { createCourtMove } from './_move'
import { personEscortRecordUser } from './_roles'
import { home, getMove } from './_routes'
import { moveDetailPage, confirmPersonEscortRecordPage } from './pages'

const latestFramework = frameworksService.getPersonEscortRecord()
const numberOfSections = Object.keys(latestFramework.sections).length

fixture('Person Escort Record').beforeEach(async t => {
  await t.useRole(personEscortRecordUser).navigateTo(home)
  await createCourtMove()
})

test('Start new Record', async t => {
  await t.navigateTo(getMove(t.ctx.move.id))

  // Check "not started" state
  await t
    .expect(moveDetailPage.nodes.tagList.getAttribute('data-tag-list-source'))
    .eql(
      'person-escort-record',
      'Should render tag list from Person Escort Record'
    )
    .expect(moveDetailPage.nodes.tagList.innerText)
    .eql(
      'Warnings will display once a Person Escort Record has been completed',
      'Should not render tags'
    )
    .expect(moveDetailPage.nodes.getUpdateLink('risk').exists)
    .ok('Should contain link to edit move request risk info')
    .expect(moveDetailPage.nodes.getUpdateLink('health').exists)
    .ok('Should contain link to edit move request health info')
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      'Start the Person Escort Record',
      'Should contain start PER banner'
    )

  // Start a new Person Escort Record
  await t.click(moveDetailPage.nodes.personEscortRecordStartButton)

  // Check "in progress" state
  await t
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      'Incomplete Person Escort Record',
      'Should contain incomplete PER banner'
    )
    .expect(moveDetailPage.nodes.getUpdateLink('risk').exists)
    .notOk('Should not contain link to edit move request risk info')
    .expect(moveDetailPage.nodes.getUpdateLink('health').exists)
    .notOk('Should not contain link to edit move request health info')
    .expect(moveDetailPage.nodes.personEscortRecordSectionLinks.count)
    .eql(numberOfSections, 'Should include review link for each PER section')
    .expect(
      moveDetailPage.nodes.personEscortRecordSectionStatuses.withText(
        'NOT STARTED'
      ).count
    )
    .eql(numberOfSections, 'Should show each section as not started')

  // Fill in PER
  await fillInPersonEscortRecord(t.ctx.move.id)

  // Check "completed" state
  await t
    .navigateTo(getMove(t.ctx.move.id))
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      'Person Escort Record has been completed',
      'Should contain completed PER banner'
    )
    .expect(moveDetailPage.nodes.getUpdateLink('risk').exists)
    .notOk('Should not contain link to edit move request risk info')
    .expect(moveDetailPage.nodes.getUpdateLink('health').exists)
    .notOk('Should not contain link to edit move request health info')
    .expect(Selector('#main-content a').withText('Review').count)
    .eql(numberOfSections, 'Should include review link for each PER section')
    .expect(
      moveDetailPage.nodes.personEscortRecordSectionStatuses.withText(
        'COMPLETED'
      ).count
    )
    .eql(numberOfSections, 'Should show each section as completed')
    .expect(moveDetailPage.nodes.personEscortRecordWarnings.count)
    .gte(1, 'Should contain risk/health information')
    .expect(moveDetailPage.nodes.tags.count)
    .gte(1, 'Should contain warning flags in header')

  // Confirm a Person Escort Record
  await t
    .click(moveDetailPage.nodes.personEscortRecordConfirmationButton)
    .expect(moveDetailPage.getCurrentUrl())
    .contains('/person-escort-record/confirm/handover')

  const handoverDetails = await confirmPersonEscortRecordPage.fillIn()

  await moveDetailPage.submitForm()

  // Check "confirmed" state
  await t
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      'Person has been handed over',
      'Should contain handed over PER banner'
    )
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      handoverDetails.handoverDispatchingOfficer,
      'Should contain dispatching officer'
    )
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      handoverDetails.handoverReceivingOfficer,
      'Should contain receiving officer'
    )
    .expect(moveDetailPage.nodes.instructionBanner.innerText)
    .contains(
      handoverDetails.handoverOtherOrganisation,
      'Should contain receiving organisation'
    )
    .expect(moveDetailPage.nodes.personEscortRecordSectionStatuses.count)
    .eql(0, 'Should not show PER sections')

  // Check that navigating back doesn't produce journey error
  const goBack = ClientFunction(() => window.history.back())
  await goBack()

  await t
    .expect(moveDetailPage.getCurrentUrl())
    .notContains(
      '/person-escort-record/confirm/provide-confirmation',
      'Should not show journey expired page'
    )
})
