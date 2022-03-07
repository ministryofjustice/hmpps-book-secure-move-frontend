const sinon = require('sinon')

const contentfulService = require('./contentful')

const mockedResponse = {
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
          ],
        },
        briefBannerText: 'Some text briefly explaining the changes.',
        date: '2022-03-04T00:00+00:00',
      },
    },
  ],
}

const emptyMockedResponse = { items: [] }

describe('Contentful Service', function () {
  it('calls the contentful.createClient method', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const results = await contentfulService.fetchEntries()
    expect(results.title).to.equal('Whats new today!')
  })

  it('returns the content title', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries.title).to.equal('Whats new today!')
  })

  it('returns the formatted body', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries.body).to.equal(
      '<h1 class="govuk-heading-l">The latest updates and improvements to Book a secure move.</h1><h2 class="govuk-heading-m">Test heading 2.</h2><h3 class="govuk-heading-s"><i>Test heading 3.</i></h3><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-body"><strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet"><li><p class="govuk-body">TEST LINE 1</p></li><li><p class="govuk-body">TEST LINE 2</p></li></ul>'
    )
  })

  it('returns the banner text', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries.bannerText).to.equal(
      'Some text briefly explaining the changes.'
    )
  })

  it('returns the formatted date', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries.date).to.equal('4 March 2022')
  })

  it('return null if no content is found', async function () {
    sinon
      .stub(contentfulService.client, 'getEntries')
      .resolves(emptyMockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries).to.equal(null)
  })
})
