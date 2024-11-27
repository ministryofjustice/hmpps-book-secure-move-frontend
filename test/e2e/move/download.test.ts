import { deleteCsvDownloads, waitForCsvDownloadFilePaths } from '../_helpers'
import { policeUser, prisonUser, stcUser, supplierUser } from '../_roles'
import { movesByDay } from '../_routes'
import { movesDashboardPage } from '../pages'

const users = [
  {
    name: 'Police user',
    role: policeUser,
  },
  {
    name: 'Prison user',
    role: prisonUser,
  },
  {
    name: 'STC user',
    role: stcUser,
  },
  {
    name: 'Supplier user',
    role: supplierUser,
  },
]

fixture('Download moves')

users.forEach(user => {
  test.before(async t => {
    deleteCsvDownloads()
    await t.useRole(user.role).navigateTo(movesByDay)
  })(`As ${user.name}`, async t => {
    await t.click(movesDashboardPage.nodes.downloadMovesLink as Selector)
    const csvDownloads = await waitForCsvDownloadFilePaths()
    await t.expect(csvDownloads![0]).ok()
  })
})
