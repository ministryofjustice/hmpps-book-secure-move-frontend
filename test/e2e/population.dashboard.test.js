import { pmuUserWithRegions } from './_roles'
import { populationDashboard } from './_routes'
import { populationDashboardPage, populationWeeklyPage } from './pages'

fixture('Population dashboards').beforeEach(async t => {
  await t.useRole(pmuUserWithRegions).navigateTo(populationDashboard)
})

test('Population dashboard navigation', async t => {
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

test('Population dashboard links', async t => {
  await t
    .click(populationDashboardPage.nodes.establishmentLink)
    .expect(populationWeeklyPage.nodes.breadcrumbs.overview.exists)
    .ok()
    .click(populationWeeklyPage.nodes.breadcrumbs.overview)
})
