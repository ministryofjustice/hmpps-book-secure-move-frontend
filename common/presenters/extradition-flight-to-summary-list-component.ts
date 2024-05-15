import { upperCase } from 'lodash'

import i18n from '../../config/i18n'
import { formatDateWithRelativeDay, formatTime } from "../../config/nunjucks/filters";
// @ts-ignore
import { ExtraditionFlight } from "../types/extradition_flight";



// @ts-ignore
/**
 * Convert a move into the structure required to render
 * as a `govukSummaryList` component
 *
 * @param {Object} flight - the extradtion flight to format
 *
 * @returns {Object} - a move formatted as a `govukSummaryList` component
 */
function extraditionFlightToSummaryListComponent(flight: ExtraditionFlight) {
  const rows: {
    key: { text?: string; html?: string }
    value: { text?: string; html?: string }
  }[] = []

    const { id: flightId, flight_time, flight_number} = flight

    rows.push(
      {
        key: {
          text: i18n.t('fields::extradition_flight_summary.number'),
        },
        value: {
          text: upperCase(flight_number || '') as string,
        },
      },
      {
        key: {
          text: i18n.t('fields::extradition_flight_summary.date'),
        },
        value: {
          text: formatDateWithRelativeDay(flight_time || '') as string,
        },
      },
      {
        key: {
          text: i18n.t('fields::extradition_flight_summary.time'),
        },
        value: {
          text: formatTime(flight_time || '') as string,
        },
      },
    )
  return { classes: 'govuk-!-font-size-16', rows }
}

module.exports = extraditionFlightToSummaryListComponent
