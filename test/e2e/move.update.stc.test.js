import {
  checkCancelLink,
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkUpdateDocuments,
  createMove,
} from './_move'
import { stcUser } from './_roles'
import { home } from './_routes'

fixture('Existing move from Secure Training Centre (STC) to Court').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'court',
        move_type: 'court_appearance',
      },
    })
  }
)

test.meta('hasDocument', 'true')(
  'User should be able to update move',
  async () => {
    await checkUpdateLinks([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
      'document',
    ])

    await checkUpdateDocuments()

    await checkUpdatePagesAccessible([
      'personal_details',
      'risk',
      'health',
      'court',
      'move',
      'date',
      'document',
    ])
  }
)

test('User should be able to cancel move', async () => {
  await checkCancelLink()
})

// fixture(
//   'Existing move from Secure Training Centre (STC) to Hospital'
// ).beforeEach(async t => {
//   await t.useRole(stcUser).navigateTo(home)
//   await createMove({
//     defaultMoveOptions: {
//       to_location_type: 'hospital',
//       move_type: 'hospital',
//     },
//   })
// })
//
// test.meta('hasDocument', 'true')(
//   'User should be able to update move',
//   async () => {
//     // await checkUpdateLinks([
//     //   'personal_details',
//     //   'risk',
//     //   'health',
//     //   'court',
//     //   'move',
//     //   'date',
//     //   'document',
//     // ])
//     //
//     // await checkUpdateDocuments()
//     //
//     // await checkUpdatePagesAccessible([
//     //   'personal_details',
//     //   'risk',
//     //   'health',
//     //   'court',
//     //   'move',
//     //   'date',
//     //   'document',
//     // ])
//
//     await checkCancelLink()
//   }
// )
//
// test('User should be able to cancel move', async () => {
//   await checkCancelLink()
// })

fixture('Existing move from Secure Training Centre (STC) to Prison').beforeEach(
  async t => {
    await t.useRole(stcUser).navigateTo(home)
    await createMove({
      defaultMoveOptions: {
        to_location_type: 'prison',
        move_type: 'prison_transfer',
      },
    })
  }
)

test.meta('hasDocument', 'true')(
  'User should not be able to update move',
  async () => {
    await checkUpdateLinks(
      [
        'personal_details',
        'risk',
        'health',
        'court',
        'move',
        'date',
        'document',
      ],
      true
    )
  }
)

test('User should be able to cancel move', async () => {
  await checkCancelLink()
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
})

test.meta('hasDocument', 'true')(
  'User should not be able to update move',
  async () => {
    await checkUpdateLinks(
      [
        'personal_details',
        'risk',
        'health',
        'court',
        'move',
        'date',
        'document',
      ],
      true
    )
  }
)

test('User should be able to cancel move', async () => {
  await checkCancelLink()
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
})

test.meta('hasDocument', 'true')(
  'User should not be able to update move',
  async () => {
    await checkUpdateLinks(
      [
        'personal_details',
        'risk',
        'health',
        'court',
        'move',
        'date',
        'document',
      ],
      true
    )
  }
)

test('User should be able to cancel move', async () => {
  await checkCancelLink()
})
