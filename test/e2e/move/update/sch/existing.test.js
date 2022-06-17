import { Selector } from 'testcafe'

import { acceptMove, startMove } from '../../../_helpers'
import { checkUpdatePagesRedirected, createMove } from '../../../_move'
import { schUser } from '../../../_roles'
import { home, getMove } from '../../../_routes'

fixture.beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
  t.ctx.move = await createMove({
    defaultMoveOptions: {
      to_location_type: 'court',
      move_type: 'court_appearance',
    },
  })
  await acceptMove(t.ctx.move.id)
  await startMove(t.ctx.move.id)
  await t.navigateTo(getMove(t.ctx.move.id))
  await t.click(Selector('a').withExactText('Details'))
})('Existing move that has left custody')

test('User should not be able to update any information', async t => {
  await checkUpdatePagesRedirected(t.ctx.move.id)
})
