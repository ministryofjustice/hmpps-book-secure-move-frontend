import { expect } from 'chai'
import sinon from 'sinon'

import { WhatsNewService } from './whats-new'

let service: WhatsNewService

describe('WhatsNewService', function () {
  beforeEach(function () {
    service = new WhatsNewService()

    sinon.stub((service as any).client, 'getEntries').resolves({ items: [] })
  })

  it('requests the right content type from Contentful', async function () {
    await (service as any).client.getEntries({ content_type: 'whatsNew' })
    expect((service as any).client.getEntries).to.have.been.calledOnceWith({
      content_type: 'whatsNew',
    })
  })
})
