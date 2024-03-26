// @ts-ignore // TODO: convert to TS
import AllocationJourney from './allocation-journey'
// @ts-ignore // TODO: convert to TS
import CancelMovePage from './cancel-move'
// @ts-ignore // TODO: convert to TS
import ConfirmPersonEscortRecordPage from './confirm-person-escort-record'
// @ts-ignore // TODO: convert to TS
import CreateMovePage from './create-move'
// @ts-ignore // TODO: convert to TS
import DashboardPage from './dashboard'
import { LodgingCancelPage } from './lodging-cancel'
import { MoveDetailPage } from './move-detail'
import { MoveLodgeLengthPage } from './move-lodge-length'
import { MoveLodgeLocationPage } from './move-lodge-location'
import { MoveLodgeSavedPage } from './move-lodge-saved'
// @ts-ignore // TODO: convert to TS
import MoveTimelinePage from './move-timeline'
// @ts-ignore // TODO: convert to TS
import MovesDashboardPage from './moves-dashboard'
import { Page } from './page'
// @ts-ignore // TODO: convert to TS
import PopulationDashboardPage from './population-dashboard'
// @ts-ignore // TODO: convert to TS
import PopulationEditPage from './population-edit'
// @ts-ignore // TODO: convert to TS
import PopulationWeeklyPage from './population-weekly'

export const page = new Page()
export const allocationJourney = new AllocationJourney()
export const lodgingCancelPage = new LodgingCancelPage()
export const moveDetailPage = new MoveDetailPage()
export const moveLodgeLocationPage = new MoveLodgeLocationPage()
export const moveLodgeLengthPage = new MoveLodgeLengthPage()
export const moveLodgeSavedPage = new MoveLodgeSavedPage()
export const moveTimelinePage = new MoveTimelinePage()
export const movesDashboardPage = new MovesDashboardPage()
export const createMovePage = new CreateMovePage()
export const cancelMovePage = new CancelMovePage()
export const dashboardPage = new DashboardPage()
export const populationDashboardPage = new PopulationDashboardPage()
export const populationEditPage = new PopulationEditPage()
export const populationWeeklyPage = new PopulationWeeklyPage()
export const confirmPersonEscortRecordPage = new ConfirmPersonEscortRecordPage()
