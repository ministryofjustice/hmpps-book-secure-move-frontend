const sinon = require('sinon')

const contentfulService = require('./contentful')

const mockedResponse = {
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
    title: "What's new today!",
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
}

describe('Contentful Service', function () {
  beforeEach(function () {
    sinon.stub(contentfulService, 'fetchEntries').resolves(mockedResponse)
  })

  it('should return the content title', async function () {
    const formattedEntries = await contentfulService.formatEntries()

    expect(formattedEntries.title).to.equal('test')
  })
})
