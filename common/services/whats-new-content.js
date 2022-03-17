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
    const entries = await service.client.getEntries()

    if (!entries.items?.length) {
      return null
    }

    const latestNotification = entries.items[0]

    const latestNotificationTitle = latestNotification.fields.title
    const latestNotificationBody = latestNotification.fields.body
    const latestNotificationDate = latestNotification.fields.date
    const latestNotificationBriefBannerText =
      latestNotification.fields.briefBannerText

    const formattedBody = service.convertToHTMLFormat(latestNotificationBody)
    const formattedDate = service.formatDate(latestNotificationDate)

    return {
      title: latestNotificationTitle,
      body: formattedBody,
      bannerText: latestNotificationBriefBannerText,
      date: formattedDate,
    }
  },
  convertToHTMLFormat: contentBody => {
    return documentToHtmlString(contentBody, options)
  },
  formatDate: date => {
    const newDate = new Date(date)
    return format(newDate, DATE_FORMATS.WITH_MONTH)
  },
}
module.exports = service
