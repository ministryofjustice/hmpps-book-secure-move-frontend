import { pmuUserWithRegions } from '../_roles'
import { populationDashboard } from '../_routes'
import { populationDashboardPage, populationWeeklyPage } from '../pages'

fixture('Population dashboards').beforeEach(async t => {
  await t.useRole(pmuUserWithRegions).navigateTo(populationDashboard)
})

test('Population dashboard navigation', async t => {
  await t
    .click((populationDashboardPage.nodes.pagination as any).previousLink)
    .expect((populationDashboardPage.nodes.days as any).count)
    .gte(1)
    .click((populationDashboardPage.nodes.pagination as any).thisWeekLink)
    .expect((populationDashboardPage.nodes.days as any).count)
    .gte(1)
    .click((populationDashboardPage.nodes.pagination as any).nextLink)
    .expect((populationDashboardPage.nodes.days as any).count)
    .gte(1)
})

test('Population dashboard links', async t => {
  await t
    .click(populationDashboardPage.nodes.establishmentLink as Selector)
    .expect((populationWeeklyPage.nodes.breadcrumbs as any).overview.exists)
    .ok()
    .click((populationWeeklyPage.nodes.breadcrumbs as any).overview)
})
