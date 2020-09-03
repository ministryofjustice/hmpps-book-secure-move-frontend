import {
  createCourtMove,
  checkNoUpdateLinks,
  checkUpdatePagesForbidden,
} from './_move'
import { prisonUser, ocaUser } from './_roles'
import { home } from './_routes'

// TODO: Reenable supplier tests
const users = [
  {
    name: 'prison user',
    role: prisonUser,
  },
  {
    name: 'OCA user',
    role: ocaUser,
  },
]

users.forEach(user => {
  fixture(`Existing move (As ${user.name})`).beforeEach(async t => {
    await t.useRole(user.role).navigateTo(home)
    await createCourtMove()
  })

  test('User should not see any update links on move page', async () => {
    await checkNoUpdateLinks()
  })

  test('User should not be able to access move update pages', async () => {
    await checkUpdatePagesForbidden()
  })
})
