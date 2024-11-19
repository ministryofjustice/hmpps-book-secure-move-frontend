import {
  policeUser,
  stcUser,
  prisonUser,
  supplierUser,
  ocaUser,
} from './_roles'
import { home, movesByDay } from './_routes'
import { dashboardPage, page, movesDashboardPage } from './pages'

const users = [
  {
    name: 'Police user',
    role: policeUser,
    displayName: 'E. Police',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'STC user',
    role: stcUser,
    displayName: 'E. Centre',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Prison user',
    role: prisonUser,
    displayName: 'E. Prison',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Supplier user',
    role: supplierUser,
    displayName: 'E. Supplier',
    homeButton: movesDashboardPage.nodes.downloadMovesLink,
  },
]

const usersWhoHaveADashboard = [
  {
    name: 'OCA user',
    role: ocaUser,
    displayName: 'E. Allocation',
    homeSection: dashboardPage.nodes.singleRequestsSection,
    homeButton: dashboardPage.nodes.singleRequestsLink,
    timePeriod: 'this week',
  },
]

fixture('Smoke tests')

users.forEach(user => {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(movesByDay)
  })(`As ${user.name}`, async t => {
    await t
      .expect((page.nodes.appHeaderOrganisation as Selector).exists)
      .ok()
      .expect((page.nodes.appHeaderProduct as Selector).exists)
      .ok()
      .expect((page.nodes.username as Selector).innerText)
      .contains(user.displayName)
      .expect((user.homeButton as Selector).exists)
      .ok()
      // Navigate
      .expect((page.nodes.pageHeading as Selector).innerText)
      .contains('today')
      .click((movesDashboardPage.nodes.pagination as any).previousLink)
      .expect((page.nodes.pageHeading as Selector).innerText)
      .contains('yesterday')
      .click((movesDashboardPage.nodes.pagination as any).todayLink)
      .expect((page.nodes.pageHeading as Selector).innerText)
      .contains('today')
      .click((movesDashboardPage.nodes.pagination as any).nextLink)
      .expect((page.nodes.pageHeading as Selector).innerText)
      .contains('tomorrow')
  })
})

usersWhoHaveADashboard.forEach(user => {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(home)
  })(`As ${user.name}`, async t => {
    await t
      .expect((page.nodes.appHeaderOrganisation as Selector).exists)
      .ok()
      .expect((page.nodes.appHeaderProduct as Selector).exists)
      .ok()
      .expect((page.nodes.username as Selector).innerText)
      .contains(user.displayName)
      .expect((page.nodes.pageHeading as Selector).innerText)
      .eql('Your overview')
      .expect((user.homeSection as Selector).exists)
      .ok()
      .expect((user.homeButton as Selector).exists)
      .ok()
      // Navigate
      .click(user.homeButton as Selector)
      .expect((page.nodes.pageHeading as Selector).innerText)
      .contains(user.timePeriod)
  })
})
