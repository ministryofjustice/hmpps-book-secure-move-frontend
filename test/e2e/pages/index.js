import CancelMovePage from './cancel-move'
import CreateMovePage from './create-move'
import MoveDetailPage from './move-detail'
import MovesDashboardPage from './moves-dashboard'
import Page from './page'
import UpdateMovePage from './update-move'

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
  UpdateMovePage,
}
