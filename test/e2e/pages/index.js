import AllocationJourney from './allocation-journey'
import CancelMovePage from './cancel-move'
import CreateMovePage from './create-move'
import DashboardPage from './dashboard'
import MoveDetailPage from './move-detail'
import MoveTimelinePage from './move-timeline'
import MovesDashboardPage from './moves-dashboard'
import Page from './page'
import PopulationDashboardPage from './population-dashboard'
import PopulationEditPage from './population-edit'
import UpdateMovePage from './update-move'

const page = new Page()
const allocationJourney = new AllocationJourney()
const moveDetailPage = new MoveDetailPage()
const moveTimelinePage = new MoveTimelinePage()
const movesDashboardPage = new MovesDashboardPage()
const createMovePage = new CreateMovePage()
const cancelMovePage = new CancelMovePage()
const dashboardPage = new DashboardPage()
const populationDashboardPage = new PopulationDashboardPage()
const populationEditPage = new PopulationEditPage()

export {
  page,
  allocationJourney,
  moveDetailPage,
  moveTimelinePage,
  movesDashboardPage,
  createMovePage,
  cancelMovePage,
  dashboardPage,
  UpdateMovePage,
  populationDashboardPage,
  populationEditPage,
}
