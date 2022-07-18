const { documentToHtmlString } = require('@contentful/rich-text-html-renderer')
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')
const { format } = require('date-fns')

const { DATE_FORMATS } = require('../../config/index')

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000

const contentfulClientService = require('./contentful-client.ts')

const options = {
  renderMark: {
    [MARKS.BOLD]: text => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: text => `<em>${text}</em>`,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, next) =>
      `<h1 class="govuk-heading-xl govuk-!-margin-top-6">${next(
        node.content
      )}</h1>`,
    [BLOCKS.HEADING_2]: (node, next) =>
      `<h2 class="govuk-heading-l govuk-!-margin-top-5">${next(
        node.content
      )}</h2>`,
    [BLOCKS.HEADING_3]: (node, next) =>
      `<h3 class="govuk-heading-m govuk-!-margin-top-4">${next(
        node.content
      )}</h3>`,
    [BLOCKS.HEADING_4]: (node, next) =>
      `<h4 class="govuk-heading-s govuk-!-margin-top-3">${next(
        node.content
      )}</h4>`,
    [BLOCKS.UL_LIST]: (node, next) =>
      `<ul class="govuk-list govuk-list--bullet govuk-list-bullet-bottom-padding">${next(
        node.content
      )}</ul>`,
    [BLOCKS.OL_LIST]: (node, next) =>
      `<ol class="govuk-list govuk-list--number">${next(node.content)}</ol>`,
    [BLOCKS.PARAGRAPH]: (node, next) =>
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
}

const service = {
  fetch: async () => {
    const entries = await service.fetchEntries()

    if (entries.length === 0) {
      return null
    }

    const formattedEntries = entries.map(({ title, body, date }) => ({
      title,
      body: service.convertToHTMLFormat(body),
      date: service.formatDate(date),
    }))

    let formattedBannerContent = null

    if (new Date() - entries[0].date <= TWO_WEEKS) {
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
    const entries = await contentfulClientService.client.getEntries({
      content_type: 'whatsNew',
    })

    if (!entries.items?.length) {
      return []
    }

    return entries.items.map(
      ({ fields: { title, body, briefBannerText, date } }) => ({
        title,
        body,
        briefBannerText,
        date: new Date(date),
      })
    )
  },
  fetchEntryBySlugId: async slugId => {
    const entry = await contentfulClientService.client.getEntries({
      content_type: 'dedicatedContent',
      'fields.slug[in]': slugId,
    })

    if (!entry.items?.length) {
      return []
    }

    const post = entry.items[0].fields
    return { title: post.title, body: service.convertToHTMLFormat(post.body) }
  },
  convertToHTMLFormat: body => documentToHtmlString(body, options),
  formatDate: date => format(date, DATE_FORMATS.WITH_MONTH),
}
module.exports = service
