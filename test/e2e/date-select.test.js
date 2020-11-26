import * as dateFns from 'date-fns'

import parsers from '../../common/parsers'

import { fillInForm } from './_helpers'
import { pmuUser } from './_roles'
import {
  home,
  incomingMoves,
  outgoingMoves,
  allocations,
  singleRequests,
} from './_routes'
import { page, movesDashboardPage } from './pages'

const jumpToDate = async (t, paginatedPage, value) => {
  const expectedDate = dateFns.format(parsers.date(value), 'yyyy-MM-dd')

  await t.navigateTo(outgoingMoves)
  await t.click(movesDashboardPage.nodes.pagination.dateSelectLink)
  await fillInForm([
    {
      selector: page.nodes.dateSelectInput,
      value,
    },
  ])
  await page.submitForm()
  await t.expect(page.getCurrentUrl()).contains(expectedDate)
}

fixture('Jump to date').beforeEach(async t => {
  await t.useRole(pmuUser).navigateTo(home)
})

test('Outgoing moves', async t => {
  await jumpToDate(t, outgoingMoves, '2020-10-01')
})

test('Incoming moves', async t => {
  await jumpToDate(t, incomingMoves, 'next tuesday')
})

test('Allocations', async t => {
  await jumpToDate(t, allocations, '1 Jan')
})

test('Single requests', async t => {
  await jumpToDate(t, singleRequests, 'last fri')
})
