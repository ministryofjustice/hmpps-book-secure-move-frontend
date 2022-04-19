import { Selector } from 'testcafe'

import {
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  createMove,
} from '../../../_move'
import { schUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture('Existing move from Secure Children Home (SCH) to Court').beforeEach(
  async t => {
    await t.useRole(schUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'court',
        move_type: 'court_appearance',
      },
    })
    await t.click(Selector('a').withExactText('Details'))
  }
)

test('User should be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], false, [
    'risk',
    'health',
  ])

  await checkUpdatePagesAccessible(
    ['personal_details', 'move', 'date', 'court'],
    false,
    ['risk', 'health']
  )
})
