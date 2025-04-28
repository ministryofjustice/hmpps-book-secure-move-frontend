import { fixture } from 'testcafe'

import { createMove } from '../../_move'
import { pmuUser } from '../../_roles'
import { home } from '../../_routes'

import { testLodges } from './_lodging-helpers'

fixture('A move without any lodgings - adding one').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('One-day lodging', async function (t) {
  await testLodges(t, 1, 1)
})

test('Two-day lodging', async function (t) {
  await testLodges(t, 1, 2)
})

test('Seven-day lodging', async function (t) {
  await testLodges(t, 1, 7)
})
