import { createMove, createCourtMove } from '../_move'
import { policeUser, courtUser } from '../_roles'
import { home, incomingMoves, outgoingMoves } from '../_routes'
import { page, movesDashboardPage } from '../pages'

fixture('Moves dashboards')

test.before(async t => {
  await t.useRole(policeUser).navigateTo(home)
})('Outgoing moves', async t => {
  const moveFixture = await createCourtMove()

  await t.navigateTo(outgoingMoves)

  const locationGroup = movesDashboardPage.nodes.locationGroup(
    moveFixture.to_location.title
  )

  await t
    .expect(locationGroup.exists)
    .ok('Should contain location grouping')
    .expect(locationGroup.innerText)
    .contains(
      moveFixture.person.fullname,
      'Location grouping should contain move'
    )
})

test.before(async t => {
  await t.useRole(courtUser).navigateTo(home)
})('Incoming moves', async t => {
  const currentLocationId =
    await page.nodes.locationMeta.getAttribute('content')
  const moveFixture = await createMove({
    moveOverrides: {
      to_location: currentLocationId,
    },
  })

  await t.navigateTo(incomingMoves)

  const locationGroup = movesDashboardPage.nodes.locationGroup(
    moveFixture.from_location.title
  )

  await t
    .expect(locationGroup.exists)
    .ok('Should contain location grouping')
    .expect(locationGroup.innerText)
    .contains(
      moveFixture.person.fullname,
      'Location grouping should contain move'
    )
})
