import {
  documentToHtmlString,
  Options,
} from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import * as contentful from 'contentful'
import { format } from 'date-fns'
import {loggers} from "winston";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_HOST,
} = require('../../config')
const { DATE_FORMATS } = require('../../config/index')

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h1 class="govuk-heading-xl govuk-!-margin-top-6">${next(
        node.content
      )}</h1>`,
    [BLOCKS.HEADING_2]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h2 class="govuk-heading-l govuk-!-margin-top-5">${next(
        node.content
      )}</h2>`,
    [BLOCKS.HEADING_3]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h3 class="govuk-heading-m govuk-!-margin-top-4">${next(
        node.content
      )}</h3>`,
    [BLOCKS.HEADING_4]: (node: { content: any }, next: (arg0: any) => any) =>
      `<h4 class="govuk-heading-s govuk-!-margin-top-3">${next(
        node.content
      )}</h4>`,
    [BLOCKS.UL_LIST]: (node: { content: any }, next: (arg0: any) => any) =>
      `<ul class="govuk-list govuk-list--bullet govuk-list-bullet-bottom-padding">${next(
        node.content
      )}</ul>`,
    [BLOCKS.OL_LIST]: (node: { content: any }, next: (arg0: any) => any) =>
      `<ol class="govuk-list govuk-list--number">${next(node.content)}</ol>`,
    [BLOCKS.PARAGRAPH]: (node: { content: any }, next: (arg0: any) => any) =>
      `<p class="govuk-body">${next(node.content)}</p>`,
    [BLOCKS.EMBEDDED_ASSET]: ({
      data: {
        target: { fields },
      },
    }) =>
      `<figure class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https:${fields.file.url}" alt="${fields.description}" /></figure>`,
    [INLINES.HYPERLINK]: (node, next) =>
      `<a class="govuk-link" href="${node.data.uri}">${next(node.content)}</a>`,
  },
} as Partial<Options>

interface ContentfulFields {
  title: string
  body: string
  briefBannerText: string
  date: string
  bannerExpiry: string
}

interface DowntimeFields {
  title: string
  start: string
  end: string
}

class ContentfulContent {
  private readonly title: string
  private readonly body: string
  private readonly briefBannerText: string
  readonly date: Date
  private readonly bannerExpiry?: Date

  constructor(data: {
    title: string
    body: string
    briefBannerText: string
    date: Date
    bannerExpiry?: Date
  }) {
    this.title = data.title
    this.body = data.body
    this.briefBannerText = data.briefBannerText
    this.date = data.date
    this.bannerExpiry = data.bannerExpiry
  }

  toEntry() {
    return {
      title: this.title,
      body: service.convertToHTMLFormat(this.body),
      date: service.formatDate(this.date),
    }
  }

  hasBannerExpired() {
    if (this.bannerExpiry) {
      return this.bannerExpiry < new Date()
    }

    return this.date.getTime() + TWO_WEEKS < Date.now()
  }

  toBanner() {
    return {
      body: this.briefBannerText,
      date: service.formatDate(this.date),
    }
  }
}
class DowntimeContent {
  readonly title: string
  readonly start: Date
  readonly end: Date | undefined
  readonly daysNotice: number

  constructor(data: {
    title: string
    start: Date
    end: Date | undefined
    daysNotice: number
  }) {
    this.title = data.title
    this.start = data.start
    this.end = data.end
    this.daysNotice = data.daysNotice
  }

  isDowntimeCurrent() {
    if (!this.end) {
      return this.start < new Date()
    }

    return this.start.getTime() < Date.now() && this.end.getTime() > Date.now()
  }

}

const service = {
  client: contentful.createClient({
    host: CONTENTFUL_HOST,
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  }),
  fetch: async () => {
    const entries = await service.fetchEntries()

    if (entries.length === 0) {
      return null
    }

    entries.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })

    return {
      bannerContent: entries
        .filter(entry => {
          return !entry.hasBannerExpired()
        })[0]
        ?.toBanner(),
      posts: entries.map(entry => entry.toEntry()),
    }
  },
  fetchEntries: async () => {
    const entries = (await service.client.getEntries({
      content_type: 'whatsNew',
    })) as contentful.EntryCollection<ContentfulFields>

    if (!entries.items?.length) {
      return []
    }

    return entries.items.map(
      ({ fields: { title, body, briefBannerText, date, bannerExpiry } }) => {
        return new ContentfulContent({
          title,
          body,
          briefBannerText,
          date: new Date(date),
          bannerExpiry: bannerExpiry ? new Date(bannerExpiry) : undefined,
        })
      }
    )
  },
  fetchEntryBySlugId: async (slugId: any) => {
    const entry = (await service.client.getEntries({
      content_type: 'dedicatedContent',
      'fields.slug[in]': slugId,
    })) as contentful.EntryCollection<ContentfulFields>

    if (!entry.items?.length) {
      return undefined
    }

    const post = entry.items[0].fields
    return { title: post.title, body: service.convertToHTMLFormat(post.body) }
  },
  convertToHTMLFormat: (body: any) => documentToHtmlString(body, options),
  formatDate: (date: any) => format(date, DATE_FORMATS.WITH_MONTH),
  fetchOutageInfo: async () => {
    const info = (await service.client.getEntries({
      content_type: 'downtime',
    })) as contentful.EntryCollection<DowntimeContent>
    console.log(info.items[0])
    if (!info.items?.length) {
      return []
    }

    return info.items.map(
      ({ fields: { title, start, end, daysNotice } }) => {
        return new DowntimeContent({
          title,
          start: new Date(start),
          end:  end ? new Date(end): undefined,
          daysNotice: daysNotice,
        })
      }
    )
  },
  getActiveOutage: async () => {
    const info = (await service.fetchOutageInfo())
    if (info.length === 0) {
      return null
    }

    info.sort((a, b) => {
      return b.start.getTime() - a.start.getTime()
    })

    return {
      end: info
        .filter(entry => {
          return entry.isDowntimeCurrent()
        })[0].end,
    }
  }

}
module.exports = service
