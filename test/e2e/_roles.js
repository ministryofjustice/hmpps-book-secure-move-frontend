import { Role } from 'testcafe'

import { E2E } from '../../config'

import { home } from './_routes'
import { page } from './pages'

export const courtUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.COURT)
  await page.chooseLocation()
})

export const policeUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.POLICE)
  await page.chooseLocation()
})

export const supplierUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.SUPPLIER)
  await page.chooseLocation()
})

export const stcUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.STC)
})

export const schUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.SCH)
})

export const prisonUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.PRISON)
})

export const ocaUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.OCA)
})

export const pmuUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.PMU)
  await page.chooseLocation()
})

export const pmuUserWithRegions = Role(home, async t => {
  await page.signIn(E2E.ROLES.PMU)
  await page.chooseRegion()
})

export const personEscortRecordUser = Role(home, async t => {
  await page.signIn(E2E.ROLES.PER)
  await page.chooseLocation()
})
