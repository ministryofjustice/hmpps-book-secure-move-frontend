import { fixture } from 'testcafe'

import { createMove } from '../../_move'
import { pmuUser } from '../../_roles'
import { home } from '../../_routes'

import { testLodges } from './_lodging-helpers'

fixture('A move without any lodges - one lodge').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

// eslint-disable-next-line no-undef
test('Without any existing lodges', async function (t) {
  await testLodges(t, 1, 1)
})

test('Without any existing lodges - two days', async function (t) {
  await testLodges(t, 1, 2)
})

test('Without any existing lodges - seven days', async function (t) {
  await testLodges(t, 1, 7)
})
