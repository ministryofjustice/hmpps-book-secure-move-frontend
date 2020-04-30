const allocationsToTable = require('./allocations-to-table')
const assessmentAnswerToTag = require('./assessment-answer-to-tag')
const assessmentAnswersByCategory = require('./assessment-answers-by-category')
const assessmentCategoryToPanelComponent = require('./assessment-category-to-panel-component')
const assessmentToSummaryListComponent = require('./assessment-to-summary-list-component')
const assessmentToTagList = require('./assessment-to-tag-list')
const courtCaseToCardComponent = require('./court-case-to-card-component')
const courtHearingToSummaryListComponent = require('./court-hearing-to-summary-list-component')
const moveToCardComponent = require('./move-to-card-component')
const moveToMetaListComponent = require('./move-to-meta-list-component')
const moveTypesToFilterComponent = require('./move-type-for-filter')
const movesByToLocation = require('./moves-by-to-location')
const movesToCSV = require('./moves-to-csv')
const movesToTable = require('./moves-to-table')
const tablePresenters = require('./object-to-table-presenters')
const personToCardComponent = require('./person-to-card-component')
const personToSummaryListComponent = require('./person-to-summary-list-component')
const timetableToTableComponent = require('./timetable-to-table-component')

module.exports = {
  allocationsToTable,
  assessmentAnswerToTag,
  assessmentAnswersByCategory,
  assessmentCategoryToPanelComponent,
  assessmentToTagList,
  assessmentToSummaryListComponent,
  courtCaseToCardComponent,
  courtHearingToSummaryListComponent,
  moveToCardComponent,
  moveToMetaListComponent,
  personToCardComponent,
  personToSummaryListComponent,
  movesByToLocation,
  movesToCSV,
  moveTypesToFilterComponent,
  movesToTable,
  tablePresenters,
  timetableToTableComponent,
}
