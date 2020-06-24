import { FEATURE_FLAGS } from '../../config'

import {
  createCourtMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkUpdateDocuments,
} from './_move'
import { stcUser } from './_roles'
import { home } from './_routes'

if (FEATURE_FLAGS.EDITABILITY) {
  fixture(
    'Existing move from Secure Training Centre (STC) to Court'
  ).beforeEach(async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createCourtMove()
  })

  test.meta('hasDocument', 'true')(
    'User should be able to update move',
    async () => {
      await checkUpdateLinks([
        'personal_details',
        'risk',
        'health',
        'court',
        'move',
        'date',
        'document',
      ])

      await checkUpdateDocuments()

      await checkUpdatePagesAccessible([
        'personal_details',
        'risk',
        'health',
        'court',
        'move',
        'date',
        'document',
      ])
    }
  )
}
