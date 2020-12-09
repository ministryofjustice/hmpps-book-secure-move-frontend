import {
  checkUpdateLinks,
  checkUpdatePagesAccessible,
  checkUpdateDocuments,
  createMove,
} from './_move'
import { schUser } from './_roles'
import { home } from './_routes'

fixture('Existing move from Secure Children Home (SCH) to Court').beforeEach(
  async t => {
    await t.useRole(schUser).navigateTo(home)
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

fixture(
  'Existing move from Secure Training Centre (STC) to Hospital'
).beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
  await createMove({
    defaultMoveOptions: {
      to_location_type: 'high_security_hospital',
      move_type: 'hospital',
    },
  })
})

test.meta('hasDocument', 'true')(
  'User should be able to update move',
  async () => {
    await checkUpdateLinks(
      ['personal_details', 'risk', 'health', 'move', 'date', 'document'],
      false,
      ['court']
    )

    await checkUpdateDocuments()

    await checkUpdatePagesAccessible(
      ['personal_details', 'risk', 'health', 'move', 'date', 'document'],
      false,
      ['court']
    )
  }
)

fixture('Existing move from Secure Children Home (SCH) to Prison').beforeEach(
  async t => {
    await t.useRole(schUser).navigateTo(home)
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

fixture(
  'Existing move from Secure Children Home (SCH) to Secure Training Centre (STC)'
).beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
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

fixture(
  'Existing move from Secure Children Home (SCH) to Secure Children Home (SCH)'
).beforeEach(async t => {
  await t.useRole(schUser).navigateTo(home)
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
