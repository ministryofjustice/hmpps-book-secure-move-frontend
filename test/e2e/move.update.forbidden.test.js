import { getRandomLocation } from './_helpers'
import {
  createCourtMove,
  checkNoUpdateLinks,
  checkUpdatePagesForbidden,
} from './_move'
import { supplierUser } from './_roles'
import { home } from './_routes'

const users = [
  {
    name: 'supplier user',
    role: supplierUser,
  },
]

users.forEach(user => {
  fixture(`Existing move (As ${user.name})`).beforeEach(async t => {
    await t.useRole(user.role).navigateTo(home)
    await createCourtMove({
      moveOverrides: {
        from_location: await getRandomLocation('police', {
          shouldHaveSupplier: true,
        }),
      },
    })
  })

  test('User should not be able to update a move', async () => {
    await checkNoUpdateLinks()

    await checkUpdatePagesForbidden()
  })
})
