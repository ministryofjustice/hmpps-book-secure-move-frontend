import { pmuUser } from './_roles'
import { populationDashboard } from './_routes'
import { populationDashboardPage } from './pages'

fixture('Population dashboards')
test.before(async t => {
  await t.useRole(pmuUser).navigateTo(populationDashboard)
})('Population dashboard navigation', async t => {
  await t
    .click(populationDashboardPage.nodes.pagination.previousLink)
    .expect(await populationDashboardPage.nodes.days.exists)
    .ok()
    .expect(await populationDashboardPage.nodes.focusDay.exists)
    .notOk()
    .click(populationDashboardPage.nodes.pagination.thisWeekLink)
    .expect(await populationDashboardPage.nodes.days.exists)
    .ok()
    .expect(await populationDashboardPage.nodes.focusDay.exists)
    .ok()
    .click(populationDashboardPage.nodes.pagination.nextLink)
    .expect(await populationDashboardPage.nodes.days.exists)
    .ok()
    .expect(await populationDashboardPage.nodes.focusDay.exists)
    .notOk()
})
