import { FEATURE_FLAGS } from '../../config'

import {
  createStcMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkUpdateDocuments,
} from './_move'

if (FEATURE_FLAGS.EDITABILITY) {
  fixture('Existing move - STC User').beforeEach(async () => {
    await createStcMove()
  })

  test('User should see expected update links on move page', async () => {
    await checkUpdateLinks([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
      'document',
    ])
  })

  test('User should see be able to access update pages', async () => {
    await checkUpdatePagesAccessible([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
      'document',
    ])
  })

  test('User should be able to update documents', async t => {
    await checkUpdateDocuments()
  })
}
