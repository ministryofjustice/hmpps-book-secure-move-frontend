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
const eventToTagComponent = require('./event-to-tag-component')
const eventToTimelineItemComponent = require('./event-to-timeline-item-component')
const eventToTimelinePanel = require('./event-to-timeline-panel')
const extraditionFlightToSummaryListComponent = require('./extradition-flight-to-summary-list-component')
const frameworkFieldToSummaryListRow = require('./framework-field-summary-list-row')
const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')
const frameworkNomisMappingsToPanel = require('./framework-nomis-mappings-to-panel')
const frameworkSectionToPanelList = require('./framework-section-to-panel-list')
const frameworkStepToSummary = require('./framework-step-to-summary')
const frameworkToTaskListComponent = require('./framework-to-task-list-component')
const moveToMessageBannerComponent = require('./message-banner/move-to-message-banner-component')
const moveToAdditionalInfoListComponent = require('./move-to-additional-info-list-component')
const moveToCardComponent = require('./move-to-card-component')
const moveToHandoversSummary = require('./move-to-handovers-summary')
const moveToIdentityBarActions = require('./move-to-identity-bar-actions')
const moveToImportantEventsTagListComponent = require('./move-to-important-events-tag-list-component')
const moveToInTransitEventsPanelList = require('./move-to-in-transit-events-panel-list')
const { moveToJourneysSummary } = require('./move-to-journeys-summary')
const moveToMetaListComponent = require('./move-to-meta-list-component')
const moveToSummaryListComponent = require('./move-to-summary-list-component')
const moveToTimelineComponent = require('./move-to-timeline-component')
const moveTypesToFilterComponent = require('./move-type-for-filter')
const movesByLocation = require('./moves-by-location')
const movesByVehicle = require('./moves-by-vehicle')
const movesToTableComponent = require('./moves-to-table-component')
const personToMetaListComponent = require('./person-to-meta-list-component')
const personToSummaryListComponent = require('./person-to-summary-list-component')
const populationToGrid = require('./population-to-grid')
const profileToCardComponent = require('./profile-to-card-component')
const singleRequestToSummaryListComponent = require('./single-request-to-summary-list-component')
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
  eventToTagComponent,
  eventToTimelineItemComponent,
  eventToTimelinePanel,
  extraditionFlightToSummaryListComponent,
  frameworkFieldToSummaryListRow,
  frameworkFlagsToTagList,
  frameworkNomisMappingsToPanel,
  frameworkSectionToPanelList,
  frameworkStepToSummary,
  frameworkToTaskListComponent,
  movesByLocation,
  movesByVehicle,
  movesToTableComponent,
  moveToAdditionalInfoListComponent,
  moveToCardComponent,
  moveToHandoversSummary,
  moveToIdentityBarActions,
  moveToImportantEventsTagListComponent,
  moveToInTransitEventsPanelList,
  moveToJourneysSummary,
  moveToMessageBannerComponent,
  moveToMetaListComponent,
  moveToSummaryListComponent,
  moveToTimelineComponent,
  moveTypesToFilterComponent,
  personToMetaListComponent,
  personToSummaryListComponent,
  populationToGrid,
  profileToCardComponent,
  singleRequestToSummaryListComponent,
  singleRequestsToTableComponent,
  tablePresenters,
  timetableToTableComponent,
}
