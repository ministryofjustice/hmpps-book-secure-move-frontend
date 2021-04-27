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
    username: 'End-to-end Police',
    displayName: 'E. Police',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'STC user',
    role: stcUser,
    username: 'End-to-end Secure Training Centre',
    displayName: 'E. Centre',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Prison user',
    role: prisonUser,
    username: 'End-to-end Prison',
    displayName: 'E. Prison',
    homeButton: movesDashboardPage.nodes.createMoveButton,
  },
  {
    name: 'Supplier user',
    role: supplierUser,
    username: 'End-to-end Supplier',
    displayName: 'E. Supplier',
    homeButton: movesDashboardPage.nodes.downloadMovesLink,
  },
]

const usersWhoHaveADashboard = [
  {
    name: 'OCA user',
    role: ocaUser,
    username: 'End-to-end Operational Capacity Allocation',
    displayName: 'E. Allocation',
    homeSection: dashboardPage.nodes.singleRequestsSection,
    homeButton: dashboardPage.nodes.singleRequestsLink,
    timePeriod: 'This week',
  },
]

fixture('Smoke tests')

users.forEach(user => {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(movesByDay)
  })(`As ${user.name}`, async t => {
    await t
      .expect(page.nodes.appHeaderOrganisation.exists)
      .ok()
      .expect(page.nodes.appHeaderProduct.exists)
      .ok()
      .expect(page.nodes.username.innerText)
      .contains(user.displayName)
      .expect(user.homeButton.exists)
      .ok()
      // Navigate
      .expect(page.nodes.pageHeading.innerText)
      .contains('Today')
      .click(movesDashboardPage.nodes.pagination.previousLink)
      .expect(page.nodes.pageHeading.innerText)
      .contains('Yesterday')
      .click(movesDashboardPage.nodes.pagination.todayLink)
      .expect(page.nodes.pageHeading.innerText)
      .contains('Today')
      .click(movesDashboardPage.nodes.pagination.nextLink)
      .expect(page.nodes.pageHeading.innerText)
      .contains('Tomorrow')
  })
})

usersWhoHaveADashboard.forEach(user => {
  test.before(async t => {
    await t.useRole(user.role).navigateTo(home)
  })(`As ${user.name}`, async t => {
    await t
      .expect(page.nodes.appHeaderOrganisation.exists)
      .ok()
      .expect(page.nodes.appHeaderProduct.exists)
      .ok()
      .expect(page.nodes.username.innerText)
      .contains(user.displayName)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Your overview')
      .expect(user.homeSection.exists)
      .ok()
      .expect(user.homeButton.exists)
      .ok()
      // Navigate
      .click(user.homeButton)
      .expect(page.nodes.pageHeading.innerText)
      .contains(user.timePeriod)
  })
})
