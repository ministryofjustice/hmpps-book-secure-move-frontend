import { fixture } from 'testcafe'

import { createMove } from '../../_move'
import { pmuUser } from '../../_roles'
import { home } from '../../_routes'

import { testLodges } from './_lodging-helpers'

fixture('Seven-day lodgings').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('Adding one', async function (t) {
  await testLodges(t, 1, 7)
})

test('Adding two', async function (t) {
  await testLodges(t, 2, 7)
})
