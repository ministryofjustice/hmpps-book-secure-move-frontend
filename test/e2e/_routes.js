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
export const newMove = `${E2E.BASE_URL}/move/new`
export const getMove = id => `${E2E.BASE_URL}/move/${id}`
export const getUpdateMove = (id, page) =>
  `${E2E.BASE_URL}/move/${id}/edit/${getUpdatePageStub(page)}`
