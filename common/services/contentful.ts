import {
  documentToHtmlString,
  Options,
} from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import * as contentful from 'contentful'
import { format } from 'date-fns'

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

    return {
      bannerContent: entries
        .filter(entry => {
          return !entry.hasBannerExpired()
        })
        .sort((a, b) => {
          return b.date.getTime() - a.date.getTime()
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
}
module.exports = service
