import { addDays, format } from 'date-fns'
import { Selector } from 'testcafe'

import {
  createCourtMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkPoliceNationalComputerReadOnly,
  checkUpdatePersonalDetails,
  checkUpdateRiskInformation,
  checkUpdateHealthInformation,
  checkUpdateCourtInformation,
  // checkUpdateMoveDetails,
  checkUpdateMoveDate,
} from '../../../_move'
import { policeUser } from '../../../_roles'
import { home, getMove } from '../../../_routes'

fixture('Existing move from Police Custody to Court').beforeEach(async t => {
  await t.useRole(policeUser).navigateTo(home)
  await createCourtMove()
  await t.click(Selector('a').withExactText('Details'))
})

test('With existing PNC number', async t => {
  await checkUpdateLinks([
    'personal_details',
    'risk',
    'health',
    'court',
    'move',
    'date',
  ])

  await checkPoliceNationalComputerReadOnly()

  await t.navigateTo(getMove(t.ctx.move.id))
  await checkUpdatePersonalDetails({
    exclude: ['policeNationalComputer'],
  })

  await checkUpdateRiskInformation()
  await checkUpdateHealthInformation()
  await checkUpdateCourtInformation()
  // await checkUpdateMoveDetails()
  await checkUpdateMoveDate()

  const anotherDate = format(addDays(new Date(), 3), 'iiii d MMM yyyy')
  await checkUpdateMoveDate(anotherDate)

  await checkUpdatePagesAccessible([
    'personal_details',
    'risk',
    'health',
    'court',
    'move',
    'date',
  ])
})

test.before(async t => {
  await t.useRole(policeUser).navigateTo(home)
  await createCourtMove({
    personOverrides: {
      policeNationalComputer: undefined,
    },
  })
  await t.click(Selector('a').withExactText('Details'))
})('Without existing PNC number', async t => {
  // TODO: re-enable this test, disabled in https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/edbe42ecfb91139355f319468fa3a5c9ce729ab4
  // await checkUpdatePersonalDetails({
  //   include: ['policeNationalComputer'],
  // })
})
