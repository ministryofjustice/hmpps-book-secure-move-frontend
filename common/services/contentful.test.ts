import { format } from 'date-fns'
import sinon from 'sinon'
import { expect } from 'chai'

const { DATE_FORMATS } = require('../../config')

const contentfulService = require('./contentful')

const todaysDate = new Date()

const whatsNewMockedResponse = {
  items: [
    {
      metadata: { tags: [] },
      sys: {
        space: { sys: [] },
        id: '3z9IGEbskrD3I8G0ZWRFkh',
        type: 'Entry',
        createdAt: '2022-02-09T09:50:50.672Z',
        updatedAt: '2022-02-10T09:22:26.455Z',
        environment: { sys: [] },
        revision: 5,
        contentType: { sys: [] },
        locale: 'en-US',
      },
      fields: {
        title: 'Whats new today!',
        body: {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'heading-1',
              content: [
                {
                  nodeType: 'text',
                  value:
                    'The latest updates and improvements to Book a secure move.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-2',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 2.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-3',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 3.',
                  marks: [{ type: 'italic' }],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-4',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 4.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'hyperlink',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test Link',
                  marks: [],
                  data: {},
                },
              ],
              data: {
                uri: 'https://google.com',
              },
            },
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Some random paragraph text.',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'unordered-list',
              content: [
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 1',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 2',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'ordered-list',
              content: [
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 1',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 2',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'embedded-asset-block',
              data: {
                target: {
                  metadata: [],
                  sys: [],
                  fields: {
                    title: 'Test asset',
                    description: 'asset-test',
                    file: {
                      url: '//images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb/image.png',
                      details: {
                        size: 497136,
                        image: { width: 867, height: 479 },
                      },
                      fileName: 'image.png',
                      contentType: 'image/png',
                    },
                  },
                },
              },

              content: [],
            },
          ],
        },
        briefBannerText: 'Some text briefly explaining the changes.',
        date: todaysDate.toISOString(),
      },
    },
  ],
}

const dedicatedContentMockedResponse = {
  items: [
    {
      metadata: { tags: [] },
      sys: {
        space: { sys: [] },
        id: '3z9IGEbskrD3I8G0ZWRFkh',
        type: 'Entry',
        createdAt: '2022-02-09T09:50:50.672Z',
        updatedAt: '2022-02-10T09:22:26.455Z',
        environment: { sys: [] },
        revision: 5,
        contentType: { sys: [] },
        locale: 'en-US',
      },
      fields: {
        title: 'Dedicated content',
        body: {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'heading-1',
              content: [
                {
                  nodeType: 'text',
                  value:
                    'The latest updates and improvements to Book a secure move.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-2',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 2.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-3',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 3.',
                  marks: [{ type: 'italic' }],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'heading-4',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test heading 4.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'hyperlink',
              content: [
                {
                  nodeType: 'text',
                  value: 'Test Link',
                  marks: [],
                  data: {},
                },
              ],
              data: {
                uri: 'https://google.com',
              },
            },
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Some random paragraph text.',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'unordered-list',
              content: [
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 1',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 2',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'ordered-list',
              content: [
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 1',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
                {
                  nodeType: 'list-item',
                  content: [
                    {
                      nodeType: 'paragraph',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'TEST LINE 2',
                          marks: [],
                          data: {},
                        },
                      ],
                      data: {},
                    },
                  ],
                  data: {},
                },
              ],
              data: {},
            },
            {
              nodeType: 'embedded-asset-block',
              data: {
                target: {
                  metadata: [],
                  sys: [],
                  fields: {
                    title: 'Test asset',
                    description: 'asset-test',
                    file: {
                      url: '//images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb/image.png',
                      details: {
                        size: 497136,
                        image: { width: 867, height: 479 },
                      },
                      fileName: 'image.png',
                      contentType: 'image/png',
                    },
                  },
                },
              },

              content: [],
            },
          ],
        },
        slug: 'dedicated-content',
        date: todaysDate.toISOString(),
      },
    },
  ],
}

const emptyMockedResponse = { items: [] }

describe('Contentful Service', function () {
  context('with a response for whats new content', function () {
    beforeEach(function () {
      sinon
        .stub(contentfulService.client, 'getEntries')
        .resolves(whatsNewMockedResponse)
    })

    it('returns the formatted body', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.posts[0].body).to.equal(
        '<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="govuk-heading-m govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s govuk-!-margin-top-3">Test heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-body"><strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet govuk-list-bullet-bottom-padding"><li><p class="govuk-body">TEST LINE 1</p></li><li><p class="govuk-body">TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p class="govuk-body">TEST LINE 1</p></li><li><p class="govuk-body">TEST LINE 2</p></li></ol><figure class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>'
      )
    })
    it('returns the content title', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.posts[0].title).to.equal('Whats new today!')
    })
    it('returns the banner text', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.bannerContent.body).to.equal(
        'Some text briefly explaining the changes.'
      )
    })
    it('returns the formatted date', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.posts[0].date).to.equal(
        format(todaysDate, DATE_FORMATS.WITH_MONTH)
      )
    })
  })

  context('with a response for dedicated content', function () {
    beforeEach(function () {
      sinon
        .stub(contentfulService.client, 'getEntries')
        .resolves(dedicatedContentMockedResponse)
    })

    it('returns the title', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.posts[0].title).to.equal('Dedicated content')
    })
    it('returns the body', async function () {
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries.posts[0].body).to.equal('<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="govuk-heading-m govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s govuk-!-margin-top-3">Test heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-body"><strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet govuk-list-bullet-bottom-padding"><li><p class="govuk-body">TEST LINE 1</p></li><li><p class="govuk-body">TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p class="govuk-body">TEST LINE 1</p></li><li><p class="govuk-body">TEST LINE 2</p></li></ol><figure class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>')
    })
  })

  context('without a response', function () {
    it('return null if no content is found', async function () {
      sinon
        .stub(contentfulService.client, 'getEntries')
        .resolves(emptyMockedResponse)
      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries).to.equal(null)
    })
  })

  context('when Contentful is down', function () {
    it('returns the error', async function () {
      sinon
        .stub(contentfulService.client, 'getEntries')
        .resolves(emptyMockedResponse)
      const response = await contentfulService.fetch()
      expect(response).to.equal(null)
    })
  })
})
