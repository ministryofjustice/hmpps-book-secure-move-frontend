const { documentToHtmlString } = require('@contentful/rich-text-html-renderer')
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')
const contentful = require('contentful')

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_DELIVERY_ACCESS_TOKEN,
} = require('../../config')

const options = {
  renderMark: {
    [MARKS.BOLD]: text => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: text => `<i>${text}</i>`,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, next) =>
      `<h1 class="govuk-heading-l">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node, next) =>
      `<h2 class="govuk-heading-m">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node, next) =>
      `<h3 class="govuk-heading-s">${next(node.content)}</h3>`,
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
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_DELIVERY_ACCESS_TOKEN,
  }),
  fetchEntries: async () => {
    const entries = await service.client.getEntries()

    if (!entries.items?.length) {
      return null
    }

    const latestNotification = entries.items[0]

    const latestNotificationTitle = latestNotification.fields.title
    const latestNotificationBody = latestNotification.fields.body

    const formattedBody = service.convertToHTMLFormat(latestNotificationBody)

    return { title: latestNotificationTitle, body: formattedBody }
  },
  convertToHTMLFormat: contentBody => {
    return documentToHtmlString(contentBody, options)
  },
}
module.exports = service
