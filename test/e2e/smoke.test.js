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
    username: 'End-to-End Test Police',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'STC user',
    role: stcUser,
    username: 'End-to-End Test STC',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Prison user',
    role: prisonUser,
    username: 'End-to-End Test Prison',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Supplier user',
    role: supplierUser,
    username: 'End-to-End Test Supplier',
    homeButton: movesDashboardPage.nodes.downloadMovesLink,
  },
]

const usersWhoHaveADashboard = [
  {
    name: 'OCA user',
    role: ocaUser,
    username: 'End-to-end OCA',
    homeSection: dashboardPage.nodes.singleRequestsSection,
    homeButton: dashboardPage.nodes.singleRequestsLink,
    timePeriod: 'This week',
  },
]

fixture('Smoke tests')

const timeout = 10000

for (const user of users) {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(movesByDay)
  })(`As ${user.name}`, async t => {
    await t
      .expect(page.nodes.appHeader.exists)
      .ok({ timeout })
      .expect(page.nodes.username.innerText)
      .eql(user.username)
      .expect(user.homeButton.exists)
      .ok({ timeout })
      // Navigate
      .expect(page.nodes.pageHeading.innerText)
      .eql('Today', { timeout })
      .click(movesDashboardPage.nodes.pagination.previousLink)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Yesterday', { timeout })
      .click(movesDashboardPage.nodes.pagination.todayLink)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Today', { timeout })
      .click(movesDashboardPage.nodes.pagination.nextLink)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Tomorrow', { timeout })
      // Sign out
      .click(page.nodes.signOutLink)
      .expect(page.nodes.signInHeader.exists)
      .ok({ timeout })
  })
}

for (const user of usersWhoHaveADashboard) {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(home)
  })(`As ${user.name}`, async t => {
    await t
      .expect(page.nodes.appHeader.exists)
      .ok()
      .expect(page.nodes.username.innerText)
      .contains(user.username)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Your overview')
      .expect(user.homeSection.exists)
      .ok()
      .expect(user.homeButton.exists)
      .ok()
      // Navigate
      .click(user.homeButton)
      .expect(page.nodes.pageHeading.innerText)
      .eql(user.timePeriod)
      // Sign out
      .click(page.nodes.signOutLink)
      .expect(page.nodes.signInHeader.exists)
      .ok()
  })
}
