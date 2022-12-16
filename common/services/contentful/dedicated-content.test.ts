import { expect } from 'chai'
import sinon from 'sinon'

import { DedicatedContentService } from './dedicated-content'

let service: DedicatedContentService
describe('DedicatedContentService', function () {
  beforeEach(function () {
    service = new DedicatedContentService()
    sinon.stub((service as any).client, 'getEntries').resolves([])
  })

  it('requests the right content type from Contentful', async function () {
    await service.fetch()
    expect((service as any).client.getEntries).to.have.been.calledOnceWith({
      content_type: 'dedicatedContent',
    })
  })
})
