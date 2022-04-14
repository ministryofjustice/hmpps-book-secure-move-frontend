import { Selector } from 'testcafe'

import { checkUpdateLinks, createMove } from '../../../_move'
import { stcUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture(
  'Existing move from Secure Training Centre (STC) to Secure Children Home (SCH)'
).beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'secure_childrens_home',
      move_type: 'prison_transfer',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], true, [
    'risk',
    'health',
  ])
})
