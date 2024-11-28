import { getRandomLocation } from '../../_helpers'
import { createCourtMove, checkUpdatePagesForbidden } from '../../_move'
import { supplierUser } from '../../_roles'
import { home } from '../../_routes'

fixture('Existing move (As supplier user)').beforeEach(async t => {
  await t.useRole(supplierUser).navigateTo(home)
  await createCourtMove({
    moveOverrides: {
      from_location: await getRandomLocation('police', {
        shouldHaveSupplier: true,
      }),
    },
  })
})

test('User should not be able to update a move', async () => {
  await checkUpdatePagesForbidden()
})
