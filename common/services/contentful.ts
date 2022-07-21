const { documentToHtmlString } = require('@contentful/rich-text-html-renderer')
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')
const contentful = require('contentful')
const { format } = require('date-fns')

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_HOST,
} = require('../../config')
const { DATE_FORMATS } = require('../../config/index')

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: any) => `<em>${text}</em>`,
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
    }: {data: {target: {fields: {file: {url: string}, description: string}}}}) =>
      `<figure class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https:${fields.file.url}" alt="${fields.description}" /></figure>`,
    [INLINES.HYPERLINK]: (node: { data: { uri: any }; content: any }, next: (arg0: any) => any) =>
      `<a class="govuk-link" href="${node.data.uri}">${next(node.content)}</a>`,
  },
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

    const formattedEntries = entries.map(( { title, body, date }: { title: string, body: string, date: any }) => ({
      title,
      body: service.convertToHTMLFormat(body),
      date: service.formatDate(date),
    }))

    let formattedBannerContent = null

    if (<any>new Date() - entries[0].date <= TWO_WEEKS) {
      formattedBannerContent = {
        body: entries[0].briefBannerText,
        date: service.formatDate(entries[0].date),
      }
    }

    return {
      bannerContent: formattedBannerContent,
      posts: formattedEntries,
    }
  },
  fetchEntries: async () => {
    const entries = await service.client.getEntries({
      content_type: 'whatsNew',
    })

    if (!entries.items?.length) {
      return []
    }

    return entries.items.map(
      ({ fields: { title, body, briefBannerText, date } }: {fields: { title: string, body: string, briefBannerText: string, date: any}}) => ({
        title,
        body,
        briefBannerText,
        date: new Date(date),
      })
    )
  },
  fetchEntryBySlugId: async (slugId: any) => {
    const entry = await service.client.getEntries({
      content_type: 'dedicatedContent',
      'fields.slug[in]': slugId,
    })

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
