import { FEATURE_FLAGS } from '../../config'

import {
  createPoliceMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkPoliceNationalComputerReadOnly,
  checkUpdatePersonalDetails,
  checkUpdateRiskInformation,
  checkUpdateHealthInformation,
  checkUpdateCourtInformation,
  checkUpdateMoveDetails,
  checkUpdateMoveDate,
} from './_move'

if (FEATURE_FLAGS.EDITABILITY) {
  fixture('Existing move from Police Custody').beforeEach(async () => {
    await createPoliceMove()
  })

  test('User should see expected update links on move page', async () => {
    await checkUpdateLinks([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
    ])
  })

  test('User should see be able to access update pages', async () => {
    await checkUpdatePagesAccessible([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
    ])
  })

  test('User should not be able to edit PNC if it already exists', async t => {
    await checkPoliceNationalComputerReadOnly()
  })

  test('User should be able to update other personal details', async () => {
    await checkUpdatePersonalDetails({
      exclude: ['policeNationalComputer'],
    })
  })

  test.before(async () => {
    await createPoliceMove({
      personOverrides: {
        policeNationalComputer: undefined,
      },
    })
  })(
    'User should be able to update PNC if it does not already exist',
    async t => {
      await checkUpdatePersonalDetails({
        include: ['policeNationalComputer'],
      })
    }
  )

  test('User should be able to update risk information', async () => {
    await checkUpdateRiskInformation()
  })

  test('User should be able to update health information', async () => {
    await checkUpdateHealthInformation()
  })

  test('User should be able to update court information', async () => {
    await checkUpdateCourtInformation()
  })

  test('User should be able to update move details for a court appearance', async () => {
    await checkUpdateMoveDetails()
  })

  test.before(async () => {
    await createPoliceMove({
      moveOverrides: {
        move_type: 'prison_recall',
      },
    })
  })(
    'User should be able to update move details for a prison recall',
    async t => {
      await checkUpdateMoveDetails()
    }
  )

  test('User should be able to change move date to tomorrow', async () => {
    await checkUpdateMoveDate()
  })

  test('User should be able to change move date to another date', async () => {
    await checkUpdateMoveDate(3)
  })
}
