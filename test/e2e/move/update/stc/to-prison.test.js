import { Selector } from 'testcafe'

import { checkUpdateLinks, createMove } from '../../../_move'
import { stcUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture('Existing move from Secure Training Centre (STC) to Prison').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'prison',
        move_type: 'prison_transfer',
      },
    })
    await t.click(Selector('a').withExactText('Details'))
  }
)

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['court', 'move', 'date'], true, ['risk', 'health'])
})
