import { every } from 'lodash'
import { readFileSync } from 'fs'

import { movesByDay } from './_routes'
import { policeUser, supplierUser } from './_roles'
import { deleteCsvDownloads, waitForCsvDownloadFilePaths } from './_helpers'
import { movesDashboardPage } from './pages'

fixture('Download moves as Police User').beforeEach(async t => {
  deleteCsvDownloads()
  await t.useRole(policeUser).navigateTo(movesByDay)
})

test('Download moves', async t => {
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

fixture('Download moves as Supplier User').beforeEach(async t => {
  await t.useRole(supplierUser).navigateTo(movesByDay)
})

test('Download moves as supplier user', async t => {
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
