import { E2E } from '../../config'

const getUpdatePageStub = page => {
  const updateMap = {
    court: 'court-information',
    date: 'move-date',
    health: 'health-information',
    move: 'move-details',
    personal_details: 'personal-details',
    risk: 'risk-information',
    document: 'document',
  }
  return updateMap[page] || page
}

export const home = E2E.BASE_URL
export const movesByDay = `${E2E.BASE_URL}/moves`
export const incomingMoves = `${E2E.BASE_URL}/moves/incoming`
export const outgoingMoves = `${E2E.BASE_URL}/moves/outgoing`
export const newMove = `${E2E.BASE_URL}/move/new`
export const getMove = id => `${E2E.BASE_URL}/move/${id}`
export const getTimeline = id => `${E2E.BASE_URL}/move/${id}/timeline`
export const getUpdateMove = (id, page) =>
  `${E2E.BASE_URL}/move/${id}/edit/${getUpdatePageStub(page)}`
export const newAllocation = `${E2E.BASE_URL}/allocation/new`
export const allocation = id => `${E2E.BASE_URL}/allocation/${id}`
export const allocations = `${E2E.BASE_URL}/allocations`
export const allocationsWithDate = date =>
  `${E2E.BASE_URL}/allocations/week/${date}/outgoing`
export const singleRequests = `${E2E.BASE_URL}/moves/requested`
export const populationDashboard = `${E2E.BASE_URL}/population`
