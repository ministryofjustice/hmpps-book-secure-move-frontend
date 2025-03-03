import { expect } from 'chai'
import { format } from 'date-fns'
import sinon from 'sinon'

import { DATE_FORMATS } from '../../../config'
import { mockDate, unmockDate } from '../../../mocks/date'

import { ContentfulContent, ContentfulService } from './contentful'

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
                      url:
                        '//images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb' +
                        '/image.png',
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
                      url:
                        '//images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb' +
                        '/image.png',
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

const formattedEntriesMockResponse = {
  bannerContent: {
    body: "Some text briefly explaining the changes.",
    date: "3 March 2025",
  },
  posts: [{
    title: 'Whats new today!',
    body: '<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure' +
          ' move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="govuk-heading-m' +
          ' govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s govuk-!-margin-top-3">Test' +
          ' heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-template__body">' +
          '<strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet ' +
          'govuk-list-bullet-bottom-padding"><li><p class="govuk-template__body">TEST LINE 1</p></li><li><p class="govuk-template__body">' +
          'TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p class="govuk-template__body">TEST LINE 1' +
          '</p></li><li><p class="govuk-template__body">TEST LINE 2</p></li></ol><figure class="govuk-!-margin-top-6 ' +
          'govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc' +
          '14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>',
    date: '3 March 2025'
  }]
}

const emptyMockedResponse = { items: [] }
let contentfulService: ContentfulService

describe('ContentfulService', function () {
  beforeEach(function () {
    // @ts-ignore
    contentfulService = new ContentfulService()
  })

  context('with a response for whats new content', function () {
    beforeEach(function () {
      sinon
        .stub((contentfulService as any).client, 'getEntries')
        .resolves(whatsNewMockedResponse)
      
      sinon
        .stub(contentfulService, 'fetch')
        .resolves(formattedEntriesMockResponse)
    })

    it('returns the formatted body', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.posts[0].body).to.equal(
        '<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure' +
          ' move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="govuk-heading-m' +
          ' govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s govuk-!-margin-top-3">Test' +
          ' heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-template__body">' +
          '<strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet ' +
          'govuk-list-bullet-bottom-padding"><li><p class="govuk-template__body">TEST LINE 1</p></li><li><p class="govuk-template__body">' +
          'TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p class="govuk-template__body">TEST LINE 1' +
          '</p></li><li><p class="govuk-template__body">TEST LINE 2</p></li></ol><figure class="govuk-!-margin-top-6 ' +
          'govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc' +
          '14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>'
      )
    })
    it('returns the content title', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.posts[0].title).to.equal('Whats new today!')
    })
    it('returns the banner text', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.bannerContent.body).to.equal(
        'Some text briefly explaining the changes.'
      )
    })
    it('returns the formatted date', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.posts[0].date).to.equal(
        format(todaysDate, DATE_FORMATS.WITH_MONTH)
      )
    })
  })

  context('with a response for dedicated content', function () {
    beforeEach(function () {
      sinon
        .stub((contentfulService as any).client, 'getEntries')
        .resolves(dedicatedContentMockedResponse)

      sinon
        .stub(contentfulService, 'fetch')
        .resolves(formattedEntriesMockResponse)
    })

    it('returns the title', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.posts[0].title).to.equal('Dedicated content')
    })
    it('returns the body', async function () {
      const formattedEntries = await contentfulService.fetch()
      // @ts-ignore
      expect(formattedEntries.posts[0].body).to.equal(
        '<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure' +
          ' move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="' +
          'govuk-heading-m govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s ' +
          'govuk-!-margin-top-3">Test heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a>' +
          '<p class="govuk-template__body"><strong>Some random paragraph text.</strong></p><ul class="govuk-list ' +
          'govuk-list--bullet govuk-list-bullet-bottom-padding"><li><p class="govuk-template__body">TEST LINE 1</p></li><li>' +
          '<p class="govuk-template__body">TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p ' +
          'class="govuk-template__body">TEST LINE 1</p></li><li><p class="govuk-template__body">TEST LINE 2</p></li></ol><figure ' +
          'class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4' +
          'W3q8OwEoyEQxjJtdtCkbg/51b7fc14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>'
      )
    })
  })

  context('without a response', function () {
    it('return null if no content is found', async function () {
      sinon
        .stub((contentfulService as any).client, 'getEntries')
        .resolves(emptyMockedResponse)
      
      sinon
        .stub(contentfulService, 'fetch')
        .resolves(formattedEntriesMockResponse)

      const formattedEntries = await contentfulService.fetch()
      expect(formattedEntries).to.equal(null)
    })
  })

  context('when Contentful is down', function () {
    it('returns the error', async function () {
      sinon
        .stub((contentfulService as any).client, 'getEntries')
        .resolves(emptyMockedResponse)
      
      sinon
        .stub(contentfulService, 'fetch')
        .resolves(formattedEntriesMockResponse)

      const response = await contentfulService.fetch()
      expect(response).to.equal(null)
    })
  })
})

describe('ContentfulContent', function () {
  let content: ContentfulContent

  beforeEach(function () {
    content = new ContentfulContent({
      title: 'Test Title',
      body: 'Test body',
      bannerText: 'Test banner text',
      date: new Date(2022, 4, 2, 16),
      expiry: new Date(2022, 4, 9, 18),
    })
  })

  describe('#getPostData', function () {
    it('returns the correct data', function () {
      expect(content.getPostData()).to.deep.eq({
        title: 'Test Title',
        body: 'Test body',
        date: '2 May 2022',
      })
    })

    context('when content.date is an invalid date', function () {
      beforeEach(function () {
        ;(content as any).date = new Date('w')
      })

      it('returns the correct data without throwing an error', function () {
        expect(content.getPostData()).to.deep.eq({
          title: 'Test Title',
          body: 'Test body',
          date: undefined,
        })
      })
    })
  })

  describe('#getBannerData', function () {
    it('returns the correct data', function () {
      expect(content.getBannerData()).to.deep.eq({
        body: 'Test banner text',
        date: '2 May 2022',
      })
    })

    context('when content.date is an invalid date', function () {
      beforeEach(function () {
        ;(content as any).date = new Date('w')
      })

      it('returns the correct data without throwing an error', function () {
        expect(content.getBannerData()).to.deep.eq({
          body: 'Test banner text',
          date: undefined,
        })
      })
    })
  })

  describe('#isCurrent', function () {
    afterEach(function () {
      unmockDate()
    })

    context('when the current date is before the content date', function () {
      it('returns false', function () {
        mockDate(2022, 4, 2, 15, 59)
        expect(content.isCurrent()).to.eq(false)
      })
    })

    context(
      'when the current date is after the content date but before the content expiry',
      function () {
        it('returns true', function () {
          mockDate(2022, 4, 2, 16)
          expect(content.isCurrent()).to.eq(true)
          mockDate(2022, 4, 9, 17, 59, 59)
          expect(content.isCurrent()).to.eq(true)
        })
      }
    )

    context('when the current date is after the content expiry', function () {
      it('returns false', function () {
        mockDate(2022, 4, 9, 18)
        expect(content.isCurrent()).to.eq(false)
      })
    })
  })
})
