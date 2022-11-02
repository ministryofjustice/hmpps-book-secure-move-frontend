import { filter, isEmpty } from 'lodash'

import i18n from '../../config/i18n'
// TODO: convert ../../config/nunjucks/filters to TS and remove this ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import filters from '../../config/nunjucks/filters'
import { Person } from '../types/person'
import { PersonEscortRecord } from '../types/person-escort-record'
import { Profile } from '../types/profile'

// TODO: convert ./framework-flags-to-tag-list to TS and remove this ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import frameworkFlagsToTagList from './framework-flags-to-tag-list'

const perSections: { [section: string]: string } = {
  'risk-information': 'Risk',
  'offence-information': 'Offence',
  'health-information': 'Health',
  'property-information': 'Property',
}

interface MetaItem {
  text?: string
  html?: string
  label: {
    text?: string
    html?: string
  }
}

export interface CardComponent {
  href?: string
  title: {
    text?: string
  }
  classes?: string
  meta?: { items: MetaItem[] }
  tags?: { items: MetaItem[] }[]
  insetText?: {
    classes: string
    html: string
  }
  image_path?: string
  image_alt?: string
}

const generatePERSectionURL = (
  personEscortRecord: PersonEscortRecord | undefined,
  hrefPrefix: string | undefined,
  section: string
) => {
  const sectionURL = `${hrefPrefix}/person-escort-record/${section}`

  if (personEscortRecord) {
    return sectionURL
  }

  return `${hrefPrefix}/person-escort-record/new?returnUrl=${encodeURIComponent(
    sectionURL
  )}`
}

const generatePERSectionAnchor = (
  personEscortRecord: PersonEscortRecord | undefined,
  hrefPrefix: string | undefined,
  section: string
) => {
  return `<a href="${generatePERSectionURL(
    personEscortRecord,
    hrefPrefix,
    section
  )}">${perSections[section]}</a>`
}

const getIncompletePERSections = (
  personEscortRecord: PersonEscortRecord | undefined
) => {
  if (!personEscortRecord?.meta?.section_progress) {
    return Object.keys(perSections)
  }

  const sectionKeys = Object.keys(perSections)

  return personEscortRecord.meta.section_progress
    .filter(({ status }) => status !== 'completed')
    .map(({ key }) => key)
    .sort((a, b) => sectionKeys.indexOf(a) - sectionKeys.indexOf(b))
}

const generateIncompletePERSectionText = (
  personEscortRecord: PersonEscortRecord | undefined,
  hrefPrefix: string | undefined
) => {
  const incompleteSections = getIncompletePERSections(personEscortRecord)

  return (
    (incompleteSections.length > 1 ? 's are ' : ' is ') +
    filters.nonOxfordJoin(
      incompleteSections.map(section =>
        generatePERSectionAnchor(personEscortRecord, hrefPrefix, section)
      )
    )
  )
}

function profileToCardComponent({
  locationType,
  meta = [],
  showImage = true,
  showMeta = true,
  showTags = true,
}: {
  locationType?: string
  meta?: MetaItem[]
  showImage?: boolean
  showMeta?: boolean
  showTags?: boolean
} = {}) {
  return function item({
    profile,
    href,
    reference,
  }: { profile?: Profile; href?: string; reference?: string } = {}) {
    const { person = {} as Person, person_escort_record: personEscortRecord } =
      profile || {}

    const {
      id,
      gender,
      _fullname: fullname,
      _image_url: imageUrl,
      date_of_birth: dateOfBirth,
    } = person

    const title =
      reference && fullname
        ? `${fullname} (${reference})`
        : fullname || i18n.t('awaiting_person')

    const card: CardComponent = {
      href,
      title: { text: title },
    }

    if (!id) {
      card.classes = 'app-card--placeholder'
    }

    if (showMeta) {
      const dateOfBirthLabel = i18n.t('age', {
        context: 'with_date_of_birth',
        age: filters.calculateAge(dateOfBirth),
        date_of_birth: filters.formatDate(dateOfBirth),
      })

      if (profile?.person && locationType) {
        if (locationType === 'prison') {
          meta.push({
            label: { text: i18n.t('fields::prison_number.label') },
            text:
              profile?.person?.prison_number ||
              i18n.t('fields::prison_number.empty'),
          })
        } else {
          meta.push({
            label: {
              html: i18n.t('fields::police_national_computer.label'),
            },
            text:
              profile?.person?.police_national_computer ||
              i18n.t('fields::police_national_computer.empty'),
          })
        }
      }

      const metaItems = [
        ...meta,
        {
          label: { text: i18n.t('fields::date_of_birth.label') },
          html: dateOfBirth ? dateOfBirthLabel : undefined,
        },
        {
          label: { text: i18n.t('fields::gender.label') },
          text: gender ? gender.title : undefined,
        },
      ]

      card.meta = {
        items: filter(metaItems, item => item.text || item.html) as MetaItem[],
      }
    }

    if (showTags) {
      const { flags, status } = personEscortRecord || {}
      const isComplete =
        personEscortRecord &&
        !['not_started', 'in_progress'].includes(status || '')

      if (isComplete) {
        card.tags = [
          {
            items: frameworkFlagsToTagList({
              flags,
              hrefPrefix: href,
              includeLink: true,
            }),
          },
        ]
      } else if (!isEmpty(person)) {
        card.insetText = {
          classes: 'govuk-inset-text--compact',
          html: `${i18n.t(
            'assessment::incomplete'
          )}<br>The incomplete section${generateIncompletePERSectionText(
            personEscortRecord,
            href
          )}.`,
        }
      }
    }

    if (showImage) {
      card.image_path = imageUrl
      card.image_alt = ''
    }

    return card
  }
}

module.exports = profileToCardComponent
