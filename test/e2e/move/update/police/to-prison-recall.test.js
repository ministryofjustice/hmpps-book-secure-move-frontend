import { Selector } from 'testcafe'

import {
  createCourtMove,
  // checkUpdateMoveDetails,
} from '../../../_move'
import { policeUser } from '../../../_roles'
import { home } from '../../../_routes'

fixture.beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(home)
  await createCourtMove({
    moveOverrides: {
      move_type: 'prison_recall',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})('Existing move from Police Custody to Prison (recall)')

test('User should be able to update move details', async t => {
  // TODO: re-enable this test, disabled in https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/edbe42ecfb91139355f319468fa3a5c9ce729ab4
  // await checkUpdateMoveDetails()
})
