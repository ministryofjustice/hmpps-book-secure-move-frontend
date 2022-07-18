const contentful = require('contentful')
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_HOST,
} = require('../../config')


const contentfulClientService = {
  client: contentful.createClient({
    host: CONTENTFUL_HOST,
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  })
}

module.exports = contentfulClientService
