import { pmuUser } from '../_roles'
import { allocation, newAllocation } from '../_routes'
import { allocationJourney, page } from '../pages'

fixture('Update an allocation').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(newAllocation)

  t.ctx.allocation = await allocationJourney.createAllocation()

  await t.navigateTo(allocation(t.ctx.allocation.id))
})

test('Change allocation date', async t => {
  await t.click(
    allocationJourney.allocationViewPage.nodes.editDetailsLink as Selector
  )

  const details = await allocationJourney.allocationDateChangePage.fill()
  await page.submitForm()

  await allocationJourney.allocationDateChangeReasonPage.fill()

  await page.submitForm()

  await allocationJourney.allocationViewPage.checkSummary({
    ...t.ctx.allocation,
    ...details,
  })
})
