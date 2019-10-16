import dotenv from 'dotenv'
import { Role } from 'testcafe'
import Page from './page-model'

dotenv.config()
const page = new Page()

export const policeUser = Role(page.locations.signout, async t => {
  await t
    .typeText('#username', process.env.E2E_POLICE_USERNAME)
    .typeText('#password', process.env.E2E_POLICE_PASSWORD)
    .pressKey('enter')
})

export const supplierUser = Role(page.locations.signout, async t => {
  await t
    .typeText('#username', process.env.E2E_SUPPLIER_USERNAME)
    .typeText('#password', process.env.E2E_SUPPLIER_PASSWORD)
    .pressKey('enter')
})
