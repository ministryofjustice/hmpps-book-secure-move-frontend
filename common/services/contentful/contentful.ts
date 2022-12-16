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
} = require('../../../config')
const { DATE_FORMATS } = require('../../../config/index')

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

export interface ContentfulFields {
  title: string
  body: string
  briefBannerText: string
  date: string
  bannerExpiry: string
}

const convertToHTMLFormat = (body: any) => documentToHtmlString(body, options)
const formatDate = (date: any) => format(date, DATE_FORMATS.WITH_MONTH)

export class ContentfulContent {
  readonly date: Date

  protected readonly title: string
  protected readonly body: string
  protected readonly bannerText: string
  protected readonly expiry: Date

  constructor(data: {
    title: string
    body: string
    bannerText: string
    date: Date
    expiry?: Date
  }) {
    this.date = data.date

    this.title = data.title
    this.body = data.body
    this.bannerText = data.bannerText
    this.expiry = data.expiry || new Date(this.date.getTime() + TWO_WEEKS)
  }

  getPostData() {
    return {
      title: this.title,
      body: this.body,
      date: formatDate(this.date),
    }
  }

  getBannerData() {
    return {
      body: this.bannerText,
      date: formatDate(this.date),
    }
  }

  isCurrent() {
    if (Date.now() < this.date.getTime()) {
      return false
    }

    return this.expiry > new Date()
  }
}

// Don't use this class, use a class that extends it. The constructor should be
//   protected, but if we set it to protected then we can't test it.
export class ContentfulService {
  protected client: contentful.ContentfulClientApi
  protected contentType: string = ''

  protected constructor() {
    this.client = contentful.createClient({
      host: CONTENTFUL_HOST,
      space: CONTENTFUL_SPACE_ID,
      accessToken: CONTENTFUL_ACCESS_TOKEN,
    })
  }

  protected createContent(fields: ContentfulFields) {
    return new ContentfulContent({
      title: fields.title,
      body: convertToHTMLFormat(fields.body),
      bannerText: fields.briefBannerText,
      date: new Date(fields.date),
      expiry: fields.bannerExpiry ? new Date(fields.bannerExpiry) : undefined,
    })
  }

  async fetchEntries() {
    const entries = (await this.client.getEntries({
      content_type: this.contentType,
    })) as contentful.EntryCollection<ContentfulFields>

    if (!entries.items?.length) {
      return []
    }

    return entries.items
      .map(e => this.createContent(e.fields))
      .sort((a, b) => {
        return b.date.getTime() - a.date.getTime()
      })
  }

  async fetch() {
    const entries = await this.fetchEntries()

    if (entries.length === 0) {
      return null
    }

    return {
      bannerContent: await this.fetchBanner(entries),
      posts: await this.fetchPosts(entries),
    }
  }

  async fetchBanner(entries?: ContentfulContent[]) {
    if (!entries) {
      entries = await this.fetchEntries()
    }

    return entries.filter(entry => entry.isCurrent())[0]?.getBannerData()
  }

  async fetchPosts(entries?: ContentfulContent[]) {
    if (!entries) {
      entries = await this.fetchEntries()
    }

    return entries.map(entry => entry.getPostData())
  }

  async fetchEntryBySlugId(slugId: any) {
    const entry = (await this.client.getEntries({
      content_type: this.contentType,
      'fields.slug[in]': slugId,
    })) as contentful.EntryCollection<ContentfulFields>

    if (!entry.items?.length) {
      return undefined
    }

    return this.createContent(entry.items[0].fields).getPostData()
  }
}
