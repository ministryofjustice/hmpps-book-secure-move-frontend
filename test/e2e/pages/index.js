import Page from './page'
import MoveDetailPage from './move-detail'
import MovesDashboardPage from './moves-dashboard'
import CreateMovePage from './create-move'
import CancelMovePage from './cancel-move'

const page = new Page()
const moveDetailPage = new MoveDetailPage()
const movesDashboardPage = new MovesDashboardPage()
const createMovePage = new CreateMovePage()
const cancelMovePage = new CancelMovePage()

export {
  page,
  moveDetailPage,
  movesDashboardPage,
  createMovePage,
  cancelMovePage,
}
