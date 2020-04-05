import { Role } from 'testcafe'

import { E2E } from '../../config'
import { home } from './_routes'
import { page } from './pages'

export const policeUser = Role(home, async t => {
  await t
    .typeText('#username', E2E.ROLES.POLICE.username)
    .typeText('#password', E2E.ROLES.POLICE.password)
    .pressKey('enter')
  await page.chooseLocation()
})

export const supplierUser = Role(home, async t => {
  await t
    .typeText('#username', E2E.ROLES.SUPPLIER.username)
    .typeText('#password', E2E.ROLES.SUPPLIER.password)
    .pressKey('enter')
  await page.chooseLocation()
})

export const stcUser = Role(home, async t => {
  await t
    .typeText('#username', E2E.ROLES.STC.username)
    .typeText('#password', E2E.ROLES.STC.password)
    .pressKey('enter')
})

export const prisonUser = Role(home, async t => {
  await t
    .typeText('#username', E2E.ROLES.PRISON.username)
    .typeText('#password', E2E.ROLES.PRISON.password)
    .pressKey('enter')
})

export const ocaUser = Role(home, async t => {
  await t
    .typeText('#username', E2E.ROLES.OCA.username)
    .typeText('#password', E2E.ROLES.OCA.password)
    .pressKey('enter')
})
