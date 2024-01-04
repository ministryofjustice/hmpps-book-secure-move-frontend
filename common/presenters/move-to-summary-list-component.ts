import { isNil } from 'lodash'

import i18n from '../../config/i18n'
import * as filters from '../../config/nunjucks/filters'
// @ts-ignore
import mapUpdateLink from '../helpers/move/map-update-link'
import { Journey } from '../types/journey'
import { Move } from '../types/move'

// @ts-ignore
import moveToHandoversSummary from './move-to-handovers-summary'
import {
  JourneySummary,
  moveToJourneysSummary,
} from './move-to-journeys-summary'

// @ts-ignore
/**
 * Convert a move into the structure required to render
 * as a `govukSummaryList` component
 *
 * @param {Object} move - the move to format
 * @param {Object} journeys - the move's journeys
 *
 * @param {Object} [options] - config options for the presenter
 * @param {Object} [options.updateUrls={}] - object containing URLs for each edit step
 *
 * @returns {Object} - a move formatted as a `govukSummaryList` component
 */
function moveToSummaryListComponent(
  move?: Move,
  journeys: Journey[] = [],
  {
    updateUrls = {},
    canAccess = (permission: string) => false,
  }: {
    updateUrls?: { [key: string]: string }
    canAccess?: (permission: string) => boolean
  } = {}
) {
  const rows: {
    key: { text?: string; html?: string }
    value: { text?: string; html?: string }
    updateJourneyKey?: string
  }[] = []

  if (move) {
    const { id: moveId, time_due: timeDue, profile } = move

    const journeysSummary = moveToJourneysSummary(move, journeys, {
      formatDate: filters.formatDateWithRelativeDay,
    })

    rows.push(
      {
        key: {
          text: i18n.t('fields::from_location.label'),
        },
        value: {
          text: journeysSummary[0].fromLocation,
        },
      },
      {
        key: {
          text: i18n.t('fields::to_location.label'),
        },
        value: {
          text: journeysSummary[journeysSummary.length - 1].toLocation,
        },
        updateJourneyKey: 'move',
      },
      {
        key: {
          text: i18n.t('fields::date_custom.label'),
        },
        value: {
          text: getMovePeriod(journeysSummary),
        },
        updateJourneyKey: 'date',
      },
      {
        key: {
          text: i18n.t('fields::time_due.label'),
        },
        value: {
          text: filters.formatTime(timeDue || '') as string,
        },
      }
    )

    const assessmentLinks = []
    const hasYouthRiskAssessment = !isNil(profile?.youth_risk_assessment)
    const hasPersonEscortRecord = !isNil(profile?.person_escort_record)

    if (hasYouthRiskAssessment && canAccess('youth_risk_assessment:view')) {
      const href = `/move/${moveId}/youth-risk-assessment`
      const text = i18n.t('youth_risk_assessment')
      assessmentLinks.push(`<a class="govuk-link" href="${href}">${text}</a>`)
    }

    if (hasPersonEscortRecord && canAccess('person_escort_record:view')) {
      const href = `/move/${moveId}/person-escort-record`
      const text = i18n.t('person_escort_record')
      assessmentLinks.push(`<a class="govuk-link" href="${href}">${text}</a>`)
    }

    if (assessmentLinks.length) {
      rows.push({
        key: { text: i18n.t('fields::documents.short_label') },
        value: {
          html:
            '<ul class="govuk-list govuk-!-font-size-16">' +
            assessmentLinks.map(link => `<li>${link}</li>`).join('') +
            '</ul>',
        },
      })
    }

    const handoversSummary = moveToHandoversSummary(move, journeys, false)

    if (handoversSummary.length) {
      const links = handoversSummary.map(
        ({
          recorded,
          event,
          location,
        }: {
          recorded: boolean
          event: string
          location: string
        }) => {
          if (recorded) {
            return `<a class="govuk-link" href="timeline#${event}">${i18n.t(
              'assessment::handover_status.text_recorded',
              { location }
            )}</a>`
          } else {
            return i18n.t('assessment::handover_status.text_awaiting', {
              location,
            })
          }
        }
      )

      rows.push({
        key: { text: i18n.t('assessment::handover_status.heading') },
        value: {
          html:
            '<ul class="govuk-list govuk-!-font-size-16">' +
            links.map((link: string) => `<li>${link}</li>`).join('') +
            '</ul>',
        },
      })
    }
  }

  return {
    classes: 'govuk-!-font-size-16',
    rows: rows
      .filter(row => row.value.text || row.value.html)
      .map(row => {
        if (!updateUrls[row.updateJourneyKey as string]) {
          return row
        }

        return {
          ...row,
          actions: {
            items: [
              mapUpdateLink(
                updateUrls[row.updateJourneyKey as string],
                row.updateJourneyKey
              ),
            ],
          },
        }
      }),
  }
}

function getMovePeriod(journeysSummary: JourneySummary[]) {
  if (journeysSummary.length === 1) {
    return journeysSummary[0].date
  }

  return (
    journeysSummary[0].date +
    ' to ' +
    journeysSummary[journeysSummary.length - 1].date
  )
}

module.exports = moveToSummaryListComponent
