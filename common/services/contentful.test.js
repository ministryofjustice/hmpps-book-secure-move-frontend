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
              nodeType: 'paragraph',
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
              nodeType: 'heading-4',
              content: [
                {
                  nodeType: 'text',
                  value: 'We love a heading 4.',
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
    const results = await contentfulService.formatEntries()
    expect(results.title).to.equal('Whats new today!')
  })

  it('returns the content title', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.formatEntries()
    expect(formattedEntries.title).to.equal('Whats new today!')
  })

  it('returns the body', async function () {
    sinon.stub(contentfulService.client, 'getEntries').resolves(mockedResponse)
    const formattedEntries = await contentfulService.formatEntries()
    expect(formattedEntries.body[0].nodeType).to.equal('paragraph')
    expect(formattedEntries.body[0].content[0].value).to.equal(
      'The latest updates and improvements to Book a secure move.'
    )
  })

  it('return null if no content is found', async function () {
    sinon
      .stub(contentfulService.client, 'getEntries')
      .resolves(emptyMockedResponse)
    const formattedEntries = await contentfulService.formatEntries()
    expect(formattedEntries).to.equal(null)
  })
})
