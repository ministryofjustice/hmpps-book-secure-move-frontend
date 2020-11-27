import { expectStatusCode } from './_helpers'
import { createMove } from './_move'
import { policeUser } from './_roles'
import { home, getTimeline } from './_routes'
import { moveTimelinePage } from './pages'

fixture('Move timeline').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(home)
  await createMove()
})

test('Check timeline exists', async t => {
  const timelineUrl = getTimeline(t.ctx.move.id)
  await expectStatusCode(timelineUrl, 200)
  // there should be the actual proposed event and a corresponding auto-inserted triggered event
  await t.expect(moveTimelinePage.nodes.timelineItems.count).eql(2)
})
