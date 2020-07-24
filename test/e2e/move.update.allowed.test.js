import {
  createCourtMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
} from './_move'
import { schUser } from './_roles'
import { home } from './_routes'

const users = [
  {
    name: 'SCH user',
    role: schUser,
  },
]

users.forEach(user => {
  fixture(`Existing move (As ${user.name})`).beforeEach(async t => {
    await t.useRole(user.role).navigateTo(home)
    await createCourtMove()
  })

  test('User should see update links on move page', async () => {
    await checkUpdateLinks()
  })

  test('User should be able to access move update pages', async () => {
    await checkUpdatePagesAccessible()
  })
})
