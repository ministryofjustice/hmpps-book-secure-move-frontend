import { Role } from 'testcafe'

import { E2E } from '../../config'

import { home } from './_routes'
import { page } from './pages'

export const courtUser = Role(home, async t => {
  await page.signIn(E2E.USERS.COURT)
  await page.chooseLocation()
})

export const policeUser = Role(home, async t => {
  await page.signIn(E2E.USERS.POLICE)
  await page.chooseLocation()
})

export const supplierUser = Role(home, async t => {
  await page.signIn(E2E.USERS.SUPPLIER)
  await page.chooseLocation()
})

export const stcUser = Role(home, async t => {
  await page.signIn(E2E.USERS.SECURE_TRAINING_CENTRE)
})

export const schUser = Role(home, async t => {
  await page.signIn(E2E.USERS.SECURE_CHILDRENS_HOME)
})

export const prisonUser = Role(home, async t => {
  await page.signIn(E2E.USERS.PRISON)
})

export const ocaUser = Role(home, async t => {
  await page.signIn(E2E.USERS.OPERATIONAL_CAPACITY_ALLOCATION)
})

export const pmuUser = Role(home, async t => {
  await page.signIn(E2E.USERS.POPULATION_MANAGEMENT_UNIT)
  await page.chooseLocation()
})

export const pmuUserWithRegions = Role(home, async t => {
  await page.signIn(E2E.USERS.POPULATION_MANAGEMENT_UNIT)
  await page.chooseRegion()
})

export const personEscortRecordUser = Role(home, async t => {
  await page.signIn(E2E.USERS.PERSON_ESCORT_RECORD)
  await page.chooseLocation()
})

export const extraditionUser = Role(home, async t => {
  await page.signIn(E2E.USERS.EXTRADITION)
  await page.chooseLocation()
})
