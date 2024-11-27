import { Selector } from 'testcafe'

import { acceptMove, startMove } from '../../../_helpers'
import { createCourtMove, checkUpdatePagesRedirected } from '../../../_move'
import { policeUser } from '../../../_roles'
import { home, getMove } from '../../../_routes'

fixture.beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(home)
  t.ctx.move = await createCourtMove()
  await acceptMove(t.ctx.move.id)
  await startMove(t.ctx.move.id)
  await t.navigateTo(getMove(t.ctx.move.id))
  await t.click(Selector('a').withExactText('Details'))
})('Existing move that has left custody')

test('User should not be able to update any information', async t => {
  await checkUpdatePagesRedirected(t.ctx.move.id, [
    'personal_details',
    'risk',
    'health',
    'court',
    'move',
    'date',
  ])
})
