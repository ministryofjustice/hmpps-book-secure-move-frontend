import {
  createPoliceMove,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkPoliceNationalComputerReadOnly,
  checkUpdatePersonalDetails,
  checkUpdateRiskInformation,
  checkUpdateHealthInformation,
  checkUpdateCourtInformation,
} from './_move'

fixture('Existing move from Police Custody to Court').beforeEach(async () => {
  await createPoliceMove()
})

test('User should see expected update links on move page', async () => {
  await checkUpdateLinks(['personal_details', 'risk', 'health', 'court'])
})

test('User should see be able to access update pages', async () => {
  await checkUpdatePagesAccessible([
    'personal_details',
    'risk',
    'health',
    'court',
    'move_details',
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
