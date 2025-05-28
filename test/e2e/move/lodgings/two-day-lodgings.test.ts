import { fixture } from 'testcafe'

import { createMove } from '../../_move'
import { pmuUser } from '../../_roles'
import { home } from '../../_routes'

import { testLodges } from './_lodging-helpers'

fixture('Two-day lodgings').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('Adding one', async function (t) {
  await testLodges(t, 1, 2)
})

test('Adding two', async function (t) {
  await testLodges(t, 2, 2)
})
