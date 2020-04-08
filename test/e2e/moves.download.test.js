import { every } from 'lodash'
import { readFileSync } from 'fs'

import { movesByDay } from './_routes'
import { policeUser, prisonUser, stcUser, supplierUser } from './_roles'
import { deleteCsvDownloads, waitForCsvDownloadFilePaths } from './_helpers'
import { movesDashboardPage } from './pages'

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
    await t.click(movesDashboardPage.nodes.downloadMovesLink)
    const csvDownloads = await waitForCsvDownloadFilePaths()

    try {
      const csvContents = readFileSync(csvDownloads[0], 'utf8')
      const lineLengths = csvContents
        .split('\n')
        .map(line => line.split(',').length)

      await t.expect(every(lineLengths)).ok()
    } catch (err) {
      throw new Error(err)
    }
  })
})
