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
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Some random paragraph text.',
                  marks: [],
                  data: {},
                },
              ],
              data: {},
            },
          ],
        },
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
      '<h1>The latest updates and improvements to Book a secure move.</h1><p>Some random paragraph text.</p>'
    )
  })

  it('return null if no content is found', async function () {
    sinon
      .stub(contentfulService.client, 'getEntries')
      .resolves(emptyMockedResponse)
    const formattedEntries = await contentfulService.fetchEntries()
    expect(formattedEntries).to.equal(null)
  })

  it('converts the content into html format', function () {
    const htmlFormatted = contentfulService.convertToHTMLFormat(
      mockedResponse.items[0].fields.body
    )
    expect(htmlFormatted).to.equal(
      '<h1>The latest updates and improvements to Book a secure move.</h1><p>Some random paragraph text.</p>'
    )
  })
})
