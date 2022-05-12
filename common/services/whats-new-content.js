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

const OPTIONS = {
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
      `<ul class="govuk-list govuk-list--bullet">${next(node.content)}</ul>`,
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
  client: contentful.createClient({
    host: CONTENTFUL_HOST,
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  }),
  fetchAll: async () => {
    const entries = await service.client.getEntries()

    if (!entries.items?.length) {
      return null
    }

    const formattedEntries = entries.items.map(entry =>
      service.formatEntry(entry)
    )

    let formattedBannerContent = null

    if (new Date() - new Date(entries.items[0].fields.date) <= TWO_WEEKS) {
      formattedBannerContent = {
        body: formattedEntries[0].briefBannerText,
        date: formattedEntries[0].date,
      }
    }

    return {
      bannerContent: formattedBannerContent,
      posts: formattedEntries,
    }
  },
  fetchOne: async id => {
    const entry = await service.client.getEntry(id)

    if (!entry) {
      return null
    }

    return service.formatEntry(entry)
  },
  formatEntry: ({ fields: { title, body, briefBannerText, date } }) => ({
    title,
    body: documentToHtmlString(body, OPTIONS),
    briefBannerText,
    date: format(new Date(date), DATE_FORMATS.WITH_MONTH),
  }),
}

module.exports = service
