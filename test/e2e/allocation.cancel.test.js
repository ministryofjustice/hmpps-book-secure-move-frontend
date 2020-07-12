import faker from 'faker'
import { Selector } from 'testcafe'

import { pmuUser } from './_roles'
import { newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('Cancel allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  const allocation = await allocationJourney.createAllocation()
  const confirmationLink = Selector('a').withExactText(
    `${allocation.movesCount} people`
  )
  await t
    .expect(confirmationLink.exists)
    .ok('Confirmation should contain allocation link')
    .click(confirmationLink)
})
test('Cancel allocation', async t => {
  await t.click(allocationJourney.allocationCancelPage.nodes.cancelLink)
  await t
    .expect(allocationJourney.getCurrentUrl())
    .match(/\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}\/cancel\/reason$/)
  const filledForm = await allocationJourney.allocationCancelPage.selectReason(
    'other',
    faker.lorem.sentence(5)
  )
  await allocationJourney.allocationCancelPage.submitForm()
  await t
    .expect(allocationJourney.getCurrentUrl())
    .match(/\/allocation\/[\w]{8}(-[\w]{4}){3}-[\w]{12}$/)
  await t
    .expect(allocationJourney.allocationCancelPage.nodes.statusHeading.exists)
    .ok()
  await t
    .expect(
      allocationJourney.allocationCancelPage.nodes.statusContent.innerText
    )
    .contains(`Reason — ${filledForm.cancellation_reason_comment}`)
})
