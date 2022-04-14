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
    [MARKS.BOLD]: text => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: text => `<i>${text}</i>`,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, next) =>
      `<h1 class="govuk-heading-l">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node, next) =>
      `<h2 class="govuk-heading-s govuk-!-margin-top-5">${next(
        node.content
      )}</h2>`,
    [BLOCKS.HEADING_3]: (node, next) =>
      `<h3 class="govuk-heading-m govuk-!-margin-top-4">${next(
        node.content
      )}</h3>`,
    [BLOCKS.HEADING_4]: (node, next) =>
      `<h4 class="govuk-heading-s">${next(node.content)}</h4>`,
    [BLOCKS.UL_LIST]: (node, next) =>
      `<ul class="govuk-list govuk-list--bullet">${next(node.content)}</ul>`,
    [BLOCKS.PARAGRAPH]: (node, next) =>
      `<p class="govuk-body">${next(node.content)}</p>`,
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
        title: entries[0].title,
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
    const entries = await service.client.getEntries()

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
  convertToHTMLFormat: body => documentToHtmlString(body, options),
  formatDate: date => format(date, DATE_FORMATS.WITH_MONTH),
}
module.exports = service
