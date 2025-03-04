import { expect } from 'chai'
import sinon from 'sinon'

import { DedicatedContentService } from './dedicated-content'
import { ContentfulService } from './contentful'

let service: DedicatedContentService
let contentfulService: ContentfulService

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

describe('DedicatedContentService', function () {
  beforeEach(function () {
    service = new DedicatedContentService()

    sinon.stub((service as any).client, 'getEntries').resolves([])
    sinon
      .stub(service, 'fetch')
      .resolves(formattedEntriesMockResponse)
  })

  it('requests the right content type from Contentful', async function () {
    await service.fetch()

    expect((service as any).client.getEntries).to.have.been.calledOnceWith({
      content_type: 'dedicatedContent',
    })
  })
})
