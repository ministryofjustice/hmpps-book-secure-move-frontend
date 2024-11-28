import { expectStatusCode } from '../_helpers'
import { createMove } from '../_move'
import { policeUser } from '../_roles'
import { home, getTimeline } from '../_routes'
import { moveTimelinePage } from '../pages'

fixture('Move timeline').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(home)
  await createMove()
})

test('Check timeline exists', async t => {
  const timelineUrl = getTimeline(t.ctx.move.id)
  await expectStatusCode(timelineUrl, 200)
  await t
    .expect((moveTimelinePage.nodes.timelineItems as Selector).count)
    .eql(1)
})
