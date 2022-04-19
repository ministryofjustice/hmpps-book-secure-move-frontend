import { pmuUserWithRegions } from '../_roles'
import { populationDashboard } from '../_routes'
import { page, populationDashboardPage, populationEditPage } from '../pages'

fixture('Population Editing').page(populationDashboard)
test.before(async t => {
  await t.useRole(pmuUserWithRegions).navigateTo(populationDashboard)
})('Editing Populations', async t => {
  await populationDashboardPage.visitAddOrEditPage()
  await populationEditPage.fill()

  await page.submitForm()
})
