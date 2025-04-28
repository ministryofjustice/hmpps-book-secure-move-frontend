import { testLodges } from './_lodging-helpers'
import { fixture } from 'testcafe'
import { pmuUser } from '../../_roles'
import { home } from '../../_routes'
import { createMove } from '../../_move'

fixture('A move without any lodgings - adding two').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('One-day lodgings', async function (t) {
  await testLodges(t, 2, 1)
})

test('Two-day lodgings', async function (t) {
  await testLodges(t, 2, 2)
})

test('Seven-day lodgings', async function (t) {
  await testLodges(t, 2, 7)
})
