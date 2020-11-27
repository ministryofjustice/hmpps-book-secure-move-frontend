import { pmuUser } from './_roles'
import { populationDashboard } from './_routes'
import { page, populationDashboardPage, populationEditPage } from './pages'

fixture('Population Editing').page(populationDashboard)
test.before(async t => {
  await t.useRole(pmuUser).navigateTo(populationDashboard)
  await populationDashboardPage.visitEditPage()
})('Editing Populations', async t => {
  await populationEditPage.fill()

  await page.submitForm()
})
