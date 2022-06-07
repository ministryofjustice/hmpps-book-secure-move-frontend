import * as dateFns from 'date-fns'

import * as parsers from '../../common/parsers'

import { fillInForm } from './_helpers'
import { pmuUser } from './_roles'
import {
  incomingMoves,
  outgoingMoves,
  allocations,
  singleRequests,
} from './_routes'
import { page, movesDashboardPage } from './pages'

const testCases = [
  {
    navigateTo: outgoingMoves,
    title: 'Outgoing moves',
    dateString: '2020-10-01',
  },
  {
    navigateTo: incomingMoves,
    title: 'Incoming moves',
    dateString: 'next tuesday',
  },
  {
    navigateTo: allocations,
    title: 'Allocations',
    dateString: '1 Jan',
  },
  {
    navigateTo: singleRequests,
    title: 'Single requests',
    dateString: 'last fri',
  },
]

fixture('Jump to date')

testCases.forEach(testCase => {
  test.before(async t => {
    await t.useRole(pmuUser).navigateTo(testCase.navigateTo)
  })(`${testCase.title} using '${testCase.dateString}'`, async t => {
    const expectedDate = dateFns.format(
      parsers.date(testCase.dateString),
      'yyyy-MM-dd'
    )

    await t.click(movesDashboardPage.nodes.pagination.dateSelectLink)
    await fillInForm([
      {
        selector: page.nodes.dateSelectInput,
        value: testCase.dateString,
      },
    ])
    await page.submitForm()
    await t.expect(page.getCurrentUrl()).contains(expectedDate)
  })
})
