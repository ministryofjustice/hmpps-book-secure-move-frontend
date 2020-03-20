import { unlinkSync, readFileSync } from 'fs'

import { movesByDay } from './_routes'
import { policeUser, supplierUser } from './roles'
import { movesDashboardPage } from './pages'
import { getCsvDownloadFilePaths, waitForCsvDownloadFilePaths } from './helpers'

function deleteDownloads() {
  const csvDownloads = getCsvDownloadFilePaths()
  for (const file of csvDownloads) {
    try {
      unlinkSync(file)
    } catch (err) {
      throw new Error(`failed to delete CSV download file: ${err.message}`)
    }
  }
}

fixture('Download moves as Police User').beforeEach(async t => {
  deleteDownloads()
  await t.useRole(policeUser).navigateTo(movesByDay)
})

test('Download moves', async t => {
  await t.click(movesDashboardPage.nodes.downloadMovesLink)

  const csvDownloads = await waitForCsvDownloadFilePaths(t, 100)

  try {
    const csvContents = readFileSync(csvDownloads[0], 'utf8')
    const contentsLines = csvContents.split('\n')
    const csvHeader = contentsLines[0].split(',')
    const csvFirstLine = contentsLines[1].split(',')

    await t.expect(csvHeader.length).eql(csvFirstLine.length)
  } catch (err) {
    throw new Error('Failed to read CSV download file')
  }
})

fixture('Download moves as Supplier User').beforeEach(async t => {
  await t.useRole(supplierUser).navigateTo(movesByDay)
})

test('Download moves as supplier user', async t => {
  await t.click(movesDashboardPage.nodes.downloadMovesLink)

  const csvDownloads = await waitForCsvDownloadFilePaths(t, 100)

  try {
    const csvContents = readFileSync(csvDownloads[0], 'utf8')
    const contentsLines = csvContents.split('\n')
    const csvHeader = contentsLines[0].split(',')
    const csvFirstLine = contentsLines[1].split(',')

    await t.expect(csvHeader.length).eql(csvFirstLine.length)
  } catch (err) {
    throw new Error('Failed to read CSV download file')
  }
})
