const allocationToMetaListComponent = require('./allocation-to-meta-list-component')
const allocationToSummaryListComponent = require('./allocation-to-summary-list-component')
const allocationsToTableComponent = require('./allocations-to-table-component')
const assessmentAnswerToTag = require('./assessment-answer-to-tag')
const assessmentAnswersByCategory = require('./assessment-answers-by-category')
const assessmentCategoryToPanelComponent = require('./assessment-category-to-panel-component')
const assessmentCategoryToSummaryListComponent = require('./assessment-category-to-summary-list-component')
const assessmentToTagList = require('./assessment-to-tag-list')
const courtCaseToCardComponent = require('./court-case-to-card-component')
const courtHearingToSummaryListComponent = require('./court-hearing-to-summary-list-component')
const eventsToTimelineComponent = require('./events-to-timeline-component')
const frameworkFieldToSummaryListRow = require('./framework-field-summary-list-row')
const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')
const frameworkNomisMappingsToPanel = require('./framework-nomis-mappings-to-panel')
const frameworkSectionToPanelList = require('./framework-section-to-panel-list')
const frameworkStepToSummary = require('./framework-step-to-summary')
const frameworkToTaskListComponent = require('./framework-to-task-list-component')
const moveToMessageBannerComponent = require('./message-banner/move-to-message-banner-component')
const moveToAdditionalInfoListComponent = require('./move-to-additional-info-list-component')
const moveToCardComponent = require('./move-to-card-component')
const moveToMetaListComponent = require('./move-to-meta-list-component')
const moveToSummaryListComponent = require('./move-to-summary-list-component')
const moveTypesToFilterComponent = require('./move-type-for-filter')
const movesByLocation = require('./moves-by-location')
const personToSummaryListComponent = require('./person-to-summary-list-component')
const locationsToPopulationTableComponent = require('./population-table/locations-to-population-table-component')
const populationToGrid = require('./population-to-grid')
const profileToCardComponent = require('./profile-to-card-component')
const singleRequestsToTableComponent = require('./single-requests-to-table-component')
const tablePresenters = require('./table')
const timetableToTableComponent = require('./timetable-to-table-component')

module.exports = {
  allocationsToTableComponent,
  allocationToMetaListComponent,
  allocationToSummaryListComponent,
  assessmentAnswersByCategory,
  assessmentAnswerToTag,
  assessmentCategoryToPanelComponent,
  assessmentCategoryToSummaryListComponent,
  assessmentToTagList,
  courtCaseToCardComponent,
  courtHearingToSummaryListComponent,
  eventsToTimelineComponent,
  frameworkFieldToSummaryListRow,
  frameworkFlagsToTagList,
  frameworkNomisMappingsToPanel,
  frameworkSectionToPanelList,
  frameworkStepToSummary,
  frameworkToTaskListComponent,
  locationsToPopulationTableComponent,
  movesByLocation,
  moveToAdditionalInfoListComponent,
  moveToCardComponent,
  moveToMessageBannerComponent,
  moveToMetaListComponent,
  moveToSummaryListComponent,
  moveTypesToFilterComponent,
  personToSummaryListComponent,
  populationToGrid,
  profileToCardComponent,
  singleRequestsToTableComponent,
  tablePresenters,
  timetableToTableComponent,
}
