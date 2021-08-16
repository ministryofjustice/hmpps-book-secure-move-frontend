/* eslint-disable indent */
const { startCase } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

// const frameworkToTaskListComponent = require('./framework-to-task-list-component')

const tagMap = {
  not_started: {
    text: i18n.t('assessment::statuses.not_started'),
    classes: 'govuk-tag--grey',
  },
  in_progress: {
    text: i18n.t('assessment::statuses.in_progress'),
    classes: 'govuk-tag--blue',
  },
  completed: {
    text: i18n.t('assessment::statuses.completed'),
  },
  confirmed: {
    text: i18n.t('assessment::statuses.completed'),
  },
  default: {
    text: 'Cannot start yet',
    classes: 'govuk-tag--grey',
  },
}

function moveToTaskListComponent(
  { id: moveId, profile, move_type: moveType, status } = {},
  { baseUrl } = {}
) {
  const canStartPER =
    (!profile.requires_youth_risk_assessment ||
      (profile.requires_youth_risk_assessment &&
        profile.youth_risk_assessment?.status === 'confirmed')) &&
    status === 'requested'
  const canStartYRA = status === 'requested'
  const sectionProgress =
    profile.person_escort_record?.meta.section_progress || []
  const incompleteSections = sectionProgress
    .filter(section => section.status !== 'completed')
    .map(section => `<strong>${startCase(section.key)}</strong>`)
  const incompleteSectionsText = ['in_progress'].includes(
    profile.person_escort_record?.status
  )
    ? `${filters.oxfordJoin(incompleteSections)} incomplete`
    : undefined

  let YRAConfirmTag = tagMap.default
  let PERConfirmTag = tagMap.default

  switch (profile.youth_risk_assessment?.status) {
    case 'completed':
      YRAConfirmTag = tagMap.not_started
      break
    case 'confirmed':
      YRAConfirmTag = tagMap.completed
      break
  }

  switch (profile.person_escort_record?.status) {
    case 'completed':
      PERConfirmTag = tagMap.not_started
      break
    case 'confirmed':
      PERConfirmTag = tagMap.completed
      break
  }

  const sections = [
    {
      heading: {
        text: 'Request a move',
      },
      items: [
        {
          text: 'Provide personal details',
          href: `${baseUrl}/personal-details`,
          tag: tagMap.completed,
        },
        {
          text: 'Provide move information',
          href: `${baseUrl}/request-information`,
          tag: tagMap.completed,
        },
      ],
    },
    moveType === 'prison_transfer'
      ? {
          heading: {
            text: 'Review single request',
          },
          items: [
            {
              text: 'Complete review',
              href: `/move/${moveId}/review`,
              tag:
                status !== 'proposed' ? tagMap.completed : tagMap.not_started,
            },
          ],
        }
      : undefined,
    profile.requires_youth_risk_assessment
      ? {
          heading: {
            text: 'Complete a Youth Risk Assessment',
          },
          items: [
            {
              text: 'Start Youth Risk Assessment',
              href: canStartYRA
                ? `/move/${moveId}/youth-risk-assessment/new?returnUrl=${encodeURI(
                    `/move/${moveId}/youth-risk-assessment`
                  )}`
                : undefined,
              tag: canStartYRA
                ? profile.youth_risk_assessment
                  ? tagMap.completed
                  : tagMap.not_started
                : tagMap.default,
            },
            {
              text: 'Provide information',
              href: profile.youth_risk_assessment
                ? `/move/${moveId}/youth-risk-assessment`
                : undefined,
              tag: tagMap[profile.youth_risk_assessment?.status || 'default'],
            },
            {
              text: 'Provide confirmation',
              href:
                profile.youth_risk_assessment?.status === 'completed' ||
                profile.youth_risk_assessment?.status === 'confirmed'
                  ? `/move/${moveId}/youth-risk-assessment/confirm`
                  : undefined,
              tag: YRAConfirmTag,
              // tag:
              //   profile.youth_risk_assessment?.status === 'confirmed'
              //     ? tagMap.completed
              //     : profile.youth_risk_assessment?.status === 'completed'
              //       ? tagMap.not_started
              //       : tagMap.default,
            },
            // ...frameworkToTaskListComponent({
            //   baseUrl: `${baseUrl}/`,
            //   deepLinkToFirstStep: false,
            //   frameworkSections: profile.person_escort_record?._framework.sections,
            //   sectionProgress: profile.person_escort_record?.meta.section_progress,
            // }).items,
          ],
        }
      : undefined,
    {
      heading: {
        text: 'Complete a Person Escort Record',
      },
      items: [
        {
          text: 'Start Person Escort Record',
          href:
            canStartPER && profile.person_escort_record === null
              ? `/move/${moveId}/person-escort-record/new?returnUrl=${encodeURI(
                  `/move/${moveId}/person-escort-record`
                )}`
              : undefined,
          tag: canStartPER
            ? profile.person_escort_record
              ? tagMap.completed
              : tagMap.not_started
            : tagMap.default,
        },
        {
          text: 'Provide information',
          supportingText: {
            html: incompleteSectionsText,
          },
          href: profile.person_escort_record
            ? `/move/${moveId}/person-escort-record`
            : undefined,
          tag: tagMap[profile.person_escort_record?.status || 'default'],
        },
        // {
        //   text: 'Record handover',
        //   href: profile.person_escort_record
        //     ? `/move/${moveId}/person-escort-record/confirm`
        //     : undefined,
        //   tag: PERConfirmTag,
        //   // tag:
        //   //   profile.person_escort_record?.status === 'completed'
        //   //     ? tagMap.not_started
        //   //     : profile.person_escort_record?.status === 'confirmed'
        //   //     ? tagMap.completed
        //   //       : tagMap.default,
        // },
        // ...frameworkToTaskListComponent({
        //   baseUrl: `${baseUrl}/`,
        //   deepLinkToFirstStep: false,
        //   frameworkSections: profile.person_escort_record?._framework.sections,
        //   sectionProgress: profile.person_escort_record?.meta.section_progress,
        // }).items,
      ],
    },
    {
      heading: {
        text: 'Handover person to supplier',
      },
      items: [
        // {
        //   text: 'Start Person Escort Record',
        //   href: canStartPER
        //     ? `/move/${moveId}/person-escort-record/new?returnUrl=${encodeURI(
        //         `/move/${moveId}/person-escort-record`
        //       )}`
        //     : undefined,
        //   tag: canStartPER
        //     ? profile.person_escort_record
        //       ? tagMap.completed
        //       : tagMap.not_started
        //     : tagMap.default,
        // },
        {
          text: 'Print Person Escort Record',
          href:
            profile.person_escort_record &&
            (profile.person_escort_record?.status === 'completed' ||
              profile.person_escort_record?.status === 'confirmed')
              ? `/move/${moveId}/person-escort-record/print`
              : undefined,
          tag:
            profile.person_escort_record?.status === 'confirmed'
              ? undefined
              : profile.person_escort_record?.status === 'completed'
              ? undefined
              : tagMap.default,
        },
        {
          text: 'Record handover',
          href:
            profile.person_escort_record &&
            profile.person_escort_record?.status === 'completed'
              ? `/move/${moveId}/person-escort-record/confirm`
              : undefined,
          tag: PERConfirmTag,
          // tag:
          //   profile.person_escort_record?.status === 'completed'
          //     ? tagMap.not_started
          //     : profile.person_escort_record?.status === 'confirmed'
          //     ? tagMap.completed
          //       : tagMap.default,
        },
        // ...frameworkToTaskListComponent({
        //   baseUrl: `${baseUrl}/`,
        //   deepLinkToFirstStep: false,
        //   frameworkSections: profile.person_escort_record?._framework.sections,
        //   sectionProgress: profile.person_escort_record?.meta.section_progress,
        // }).items,
      ],
    },
  ]

  return {
    sections: sections.filter(Boolean),
  }
}

module.exports = moveToTaskListComponent
