import { Selector } from 'testcafe'

import { acceptMove, startMove } from './_helpers'
import {
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkUpdatePagesRedirected,
  createMove,
} from './_move'
import { stcUser } from './_roles'
import { home, getMove } from './_routes'

fixture('Existing move from Secure Training Centre (STC) to Court').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'court',
        move_type: 'court_appearance',
      },
    })
    await t.click(Selector('a').withExactText('Details'))
  }
)

test('User should be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], false, [
    'risk',
    'health',
  ])

  await checkUpdatePagesAccessible(
    ['personal_details', 'move', 'date', 'court'],
    false,
    ['risk', 'health']
  )
})

fixture(
  'Existing move from Secure Training Centre (STC) to Hospital'
).beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'high_security_hospital',
      move_type: 'hospital',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'move', 'date'], false, [
    'court',
    'risk',
    'health',
  ])

  await checkUpdatePagesAccessible(
    ['personal_details', 'move', 'date'],
    false,
    ['court', 'risk', 'health']
  )
})

fixture('Existing move from Secure Training Centre (STC) to Prison').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'prison',
        move_type: 'prison_transfer',
      },
    })
    await t.click(Selector('a').withExactText('Details'))
  }
)

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], true, [
    'risk',
    'health',
  ])
})

fixture(
  'Existing move from Secure Training Centre (STC) to Secure Training Centre (STC)'
).beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'secure_training_centre',
      move_type: 'prison_transfer',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], true, [
    'risk',
    'health',
  ])
})

fixture(
  'Existing move from Secure Training Centre (STC) to Secure Children Home (SCH)'
).beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'secure_childrens_home',
      move_type: 'prison_transfer',
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})

test('User should not be able to update move', async () => {
  await checkUpdateLinks(['personal_details', 'court', 'move', 'date'], true, [
    'risk',
    'health',
  ])
})

fixture.beforeEach(async t => {
  await t.useRole(stcUser).navigateTo(home)
  t.ctx.move = await createMove({
    defaultMoveOptions: {
      to_location_type: 'court',
      move_type: 'court_appearance',
    },
  })
  await acceptMove(t.ctx.move.id)
  await startMove(t.ctx.move.id)
  await t.navigateTo(getMove(t.ctx.move.id))
  await t.click(Selector('a').withExactText('Details'))
})('Existing move that has left custody')

test('User should not be able to update any information', async t => {
  // No edit links should be visible
  await checkUpdateLinks(undefined, true)
  await checkUpdatePagesRedirected(t.ctx.move.id)
})
