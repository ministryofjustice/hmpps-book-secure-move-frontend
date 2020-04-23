import { FEATURE_FLAGS } from '../../config'

import {
  createStcMove,
  checkNoUpdateLinks,
  checkUpdatePagesForbidden,
} from './_move'

if (FEATURE_FLAGS.EDITABILITY) {
  fixture(
    'Existing move from Secure Training Centre (STC) to Court'
  ).beforeEach(async () => {
    await createStcMove()
  })

  test('User should not see any update links on move page', async () => {
    await checkNoUpdateLinks()
  })

  test('User should not be able to access move update pages', async () => {
    await checkUpdatePagesForbidden()
  })
}
