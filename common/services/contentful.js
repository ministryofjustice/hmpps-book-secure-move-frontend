const contentful = require('contentful')

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_DELIVERY_ACCESS_TOKEN,
} = require('../../config')

const service = {
  formatEntries: async () => {
    const entries = await service.fetchEntries()

    if (!entries.items?.length) {
      return null
    }

    const latestNotification = entries.items[0]

    const latestNotificationTitle = latestNotification.fields.title
    const latestNotificationBody = latestNotification.fields.body.content

    return { title: latestNotificationTitle, body: latestNotificationBody }
  },
  fetchEntries: async () => {
    const client = contentful.createClient({
      space: CONTENTFUL_SPACE_ID,
      accessToken: CONTENTFUL_DELIVERY_ACCESS_TOKEN,
    })

    const entries = await client.getEntries()

    return entries
  },
}

module.exports = service
