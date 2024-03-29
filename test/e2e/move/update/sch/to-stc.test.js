import { Selector } from 'testcafe'

import { checkUpdateLinks, createMove } from '../../../_move'
import { schUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture(
  'Existing move from Secure Children Home (SCH) to Secure Training Centre (STC)'
).beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'secure_training_centre',
      move_type: 'prison_transfer',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['court', 'move', 'date'], true, ['risk', 'health'])
})
