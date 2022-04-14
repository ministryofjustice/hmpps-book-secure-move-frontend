import { pmuUserWithRegions } from '../_roles'
import { populationDashboard } from '../_routes'
import { populationDashboardPage, populationWeeklyPage } from '../pages'

fixture('Population dashboards').beforeEach(async t => {
  await t.useRole(pmuUserWithRegions).navigateTo(populationDashboard)
})

test('Population dashboard navigation', async t => {
  await t
    .click(populationDashboardPage.nodes.pagination.previousLink)
    .expect(populationDashboardPage.nodes.days.count)
    .gte(1)
    .click(populationDashboardPage.nodes.pagination.thisWeekLink)
    .expect(populationDashboardPage.nodes.days.count)
    .gte(1)
    .click(populationDashboardPage.nodes.pagination.nextLink)
    .expect(populationDashboardPage.nodes.days.count)
    .gte(1)
})

test('Population dashboard links', async t => {
  await t
    .click(populationDashboardPage.nodes.establishmentLink)
    .expect(populationWeeklyPage.nodes.breadcrumbs.overview.exists)
    .ok()
    .click(populationWeeklyPage.nodes.breadcrumbs.overview)
})
