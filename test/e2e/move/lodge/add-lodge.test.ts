import { fixture } from 'testcafe'

// @ts-ignore // TODO: convert to TS
import { createMove } from '../../_move'
// @ts-ignore // TODO: convert to TS
import { pmuUser } from '../../_roles'
// @ts-ignore // TODO: convert to TS
import { home } from '../../_routes'
import { moveDetailPage } from '../../pages'

fixture('A move without any lodges').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
  await createMove()
})

test('Without any existing lodges', async function (t) {
  await t.click(moveDetailPage.nodes.addLodgeButton)

  // await moveLodgeLocationPage.pickRandomLocation()
  // await moveLodgeLengthPage.pickOneDay()
  // await moveLodgeLengthPage.pickTwoDays() - in another test
  // await moveLodgeLengthPage.pickCustomDays(7) - in another another test
  //
  // await checkAddLodgeSuccessMessage()

  // navigate back to move details

  // await t.click(moveDetailPage.nodes.addAnotherLodgeButton)

  // await moveLodgeLocationPage.pickRandomLocation()
  // await moveLodgeLengthPage.pickOneDay()
  // await moveLodgeLengthPage.pickTwoDays() - in another test
  // await moveLodgeLengthPage.pickCustomDays(7) - in another another test
  //
  // await checkAddLodgeSuccessMessage()
})
