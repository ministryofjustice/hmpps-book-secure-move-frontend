import { fixture } from 'testcafe'

// @ts-ignore // TODO: convert to TS
import { createMove } from '../../_move'
// @ts-ignore // TODO: convert to TS
import { pmuUser } from '../../_roles'
// @ts-ignore // TODO: convert to TS
import { home } from '../../_routes'
import {
  moveDetailPage,
  moveLodgeLengthPage,
  moveLodgeLocationPage,
  moveLodgeSavedPage,
} from '../../pages'

fixture.skip('A move without any lodges').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('Without any existing lodges', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(1)
})

test('Without any existing lodges - two days', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickTwoDays()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(2)
})

test('Without any existing lodges - seven days', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickCustomDays('7')
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(7)
})

test('Add two lodges', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(1)
  await t.click(moveLodgeSavedPage.nodes.moveLink)
  await t.click(moveDetailPage.nodes.addAnotherLodgeButton)
  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(1)
})

test('Add two lodges - two nights', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(2)
  await t.click(moveLodgeSavedPage.nodes.moveLink)
  await t.click(moveDetailPage.nodes.addAnotherLodgeButton)
  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(2)
})
test('Add two lodges - seven nights', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(7)
  await t.click(moveLodgeSavedPage.nodes.moveLink)
  await t.click(moveDetailPage.nodes.addAnotherLodgeButton)
  await moveLodgeLocationPage.pickRandomLocation()
  await moveLodgeLengthPage.pickOneDay()
  await moveLodgeSavedPage.checkAddLodgeSuccessMessage(7)
})
