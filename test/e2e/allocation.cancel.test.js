import faker from 'faker'

import { pmuUser } from './_roles'
import { allocations, newAllocation } from './_routes'
import { allocationJourney } from './pages/'

fixture('Cancel allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)
  await allocationJourney.createAllocation()
  await t.navigateTo(allocations)
})
test('Cancel allocation', async t => {
  await t.click(
    allocationJourney.allocationCancelPage.nodes.linkToFirstAllocation
  )
  await allocationJourney.scrollToBottom()
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
