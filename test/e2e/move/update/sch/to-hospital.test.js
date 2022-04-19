import { Selector } from 'testcafe'

import {
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  createMove,
} from '../../../_move'
import { schUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture(
  'Existing move from Secure Training Centre (STC) to Hospital'
).beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'high_security_hospital',
      move_type: 'hospital',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'move', 'date'], false, [
    'court',
    'risk',
    'health',
  ])

  await checkUpdatePagesAccessible(
    ['personal_details', 'move', 'date'],
    false,
    ['court', 'risk', 'health']
  )
})
