import { expect } from 'chai'
import * as contentful from 'contentful'
import sinon from 'sinon'

import { DedicatedContentService } from './dedicated-content'
import { ContentfulEntry } from './contentful'

let service: DedicatedContentService

describe('DedicatedContentService', function () {
  beforeEach(function () {
    service = new DedicatedContentService()

    sinon.stub(service.getClient(), 'getEntries').resolves({
      items: [],
      total: 0,
      skip: 0,
      limit: 0,
      stringifySafe: '',
    } as unknown as contentful.EntryCollection<ContentfulEntry>)
  })

  it('requests the right content type from Contentful', async function () {
    await service.getClient().getEntries({
      content_type: 'dedicatedContent',
    })

    expect(service.getClient().getEntries).to.have.been.calledOnceWith({
      content_type: 'dedicatedContent',
    })
  })
})
