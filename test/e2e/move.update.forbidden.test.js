import { FEATURE_FLAGS } from '../../config'

import {
  createCourtMove,
  checkNoUpdateLinks,
  checkUpdatePagesForbidden,
} from './_move'
import { prisonUser, ocaUser, supplierUser } from './_roles'
import { home } from './_routes'

const users = [
  {
    name: 'prison user',
    role: prisonUser,
  },
  {
    name: 'OCA user',
    role: ocaUser,
  },
  {
    name: 'supplier user',
    role: supplierUser,
  },
]

if (FEATURE_FLAGS.EDITABILITY) {
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
}
