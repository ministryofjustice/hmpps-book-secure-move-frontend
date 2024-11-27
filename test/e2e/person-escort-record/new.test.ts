import { ClientFunction } from 'testcafe'

import { fillInPersonEscortRecord } from '../_helpers'
import { createCourtMove } from '../_move'
import { personEscortRecordUser } from '../_roles'
import { home, getMove } from '../_routes'
import { moveDetailPage, confirmPersonEscortRecordPage } from '../pages'

const numberOfSections = 4

fixture('Person Escort Record').beforeEach(async t => {
  await t.useRole(personEscortRecordUser).navigateTo(home)
  await createCourtMove()
})

test('Start new Record', async t => {
  await t.navigateTo(getMove(t.ctx.move.id))

  // Check "not started" state
  await t
    .expect(
      (moveDetailPage.nodes.tagList as Selector).getAttribute(
        'data-tag-list-source'
      )
    )
    .eql(
      'person-escort-record',
      'Should render tag list from Person Escort Record'
    )
    .expect((moveDetailPage.nodes.tagList as Selector).innerText)
    .eql(
      'This will display once the Person Escort Record has been completed in full.',
      'Should not render tags'
    )
    .expect((moveDetailPage.nodes.identityBar as Selector).innerText)
    .contains('Start Person Escort Record', 'Should contain start PER banner')

  // Start a new Person Escort Record
  await t.click(moveDetailPage.nodes.personEscortRecordStartButton as Selector)

  // Check "in progress" state
  await t
    .expect((moveDetailPage.nodes.getUpdateLink as Selector)('risk').exists)
    .notOk('Should not contain link to edit move request risk info')
    .expect((moveDetailPage.nodes.getUpdateLink as Selector)('health').exists)
    .notOk('Should not contain link to edit move request health info')
    .expect(
      (moveDetailPage.nodes.personEscortRecordSectionLinks as Selector).count
    )
    .eql(numberOfSections, 'Should include link for each PER section')
    .expect(
      (
        moveDetailPage.nodes.personEscortRecordSectionStatuses as Selector
      ).withText('Not started').count
    )
    .eql(numberOfSections, 'Should show each section as not started')

  // Fill in PER
  await fillInPersonEscortRecord(t.ctx.move.id)

  // Check "completed" state on move details
  await t
    .navigateTo(getMove(t.ctx.move.id))
    .expect((moveDetailPage.nodes.getUpdateLink as Selector)('risk').exists)
    .notOk('Should not contain link to edit move request risk info')
    .expect((moveDetailPage.nodes.getUpdateLink as Selector)('health').exists)
    .notOk('Should not contain link to edit move request health info')
    .expect((moveDetailPage.nodes.identityBar as Selector).innerText)
    .contains('View Person Escort Record', 'Should contain view PER button')
    .expect((moveDetailPage.nodes.personEscortRecordWarnings as Selector).count)
    .gte(1, 'Should contain risk/health information')
    .expect((moveDetailPage.nodes.tags as Selector).count)
    .gte(1, 'Should contain warning flags in header')

  // Check "completed" state on PER
  await t
    .click(moveDetailPage.nodes.personEscortRecordViewButton as Selector)
    .expect(
      (moveDetailPage.nodes.personEscortRecordSectionLinks as Selector).count
    )
    .eql(numberOfSections, 'Should include link for each PER section')
    .expect(
      (
        moveDetailPage.nodes.personEscortRecordSectionStatuses as Selector
      ).withText('Completed').count
    )
    .eql(numberOfSections, 'Should show each section as completed')

  // Confirm a Person Escort Record
  await t
    .navigateTo(getMove(t.ctx.move.id))
    .click(
      moveDetailPage.nodes.personEscortRecordConfirmationButton as Selector
    )
    .expect(moveDetailPage.getCurrentUrl())
    .contains('/person-escort-record/confirm/handover')

  await confirmPersonEscortRecordPage.fillIn()
  await moveDetailPage.submitForm()

  // Check "confirmed" state
  await t
    .expect((moveDetailPage.nodes.instructionBanner as Selector).innerText)
    .contains(
      'Handover recorded successfully',
      'Should contain handed over PER banner'
    )

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
