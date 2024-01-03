import { expect } from 'chai'
import sinon from 'sinon'

import { mockDate, unmockDate } from '../../../mocks/date'

import { DowntimeContent, DowntimeService } from './downtime'

describe('DowntimeService', function () {
  let service: DowntimeService

  beforeEach(function () {
    service = new DowntimeService()
    sinon.stub((service as any).client, 'getEntries').resolves({ items: [] })
  })

  afterEach(function () {
    unmockDate()
  })

  it('requests the right content type from Contentful', async function () {
    await service.fetch()
    expect((service as any).client.getEntries).to.have.been.calledOnceWith({
      content_type: 'downtime',
    })
  })

  describe('#fetchPosts', function () {
    beforeEach(function () {
      // 2022-05-05 13:35:00 - because of daylight savings time
      mockDate(2022, 4, 5, 14, 35)
      ;(service as any).client.getEntries.resolves({
        items: [
          {
            fields: {
              start: '2022-05-06T13:00:00.000Z',
              end: '2022-05-06T15:00:00.000Z',
              daysNotice: 7,
            },
          },
          {
            fields: {
              start: '2022-05-05T13:00:00.000Z',
              end: '2022-05-05T15:00:00.000Z',
              daysNotice: 7,
            },
          },
        ],
      })
    })

    it('only returns content that isActive', async function () {
      expect((await service.fetchPosts()).length).to.eq(1)
    })
  })
})

describe('DowntimeContent', function () {
  let content: DowntimeContent

  beforeEach(function () {
    content = new DowntimeContent({
      start: new Date(2022, 4, 9, 16),
      end: new Date(2022, 4, 9, 18),
      daysNotice: 7,
      bannerText: 'This is a test outage message',
    })
  })

  afterEach(function () {
    unmockDate()
  })

  describe('#isCurrent', function () {
    context(
      'when the current date is more than 7 days prior to the start of the downtime',
      function () {
        it('returns false', function () {
          mockDate(2022, 4, 2, 15, 59)
          expect(content.isCurrent()).to.eq(false)
        })
      }
    )

    context(
      'when the current date is less than 7 days prior to the start of the downtime',
      function () {
        it('returns true', function () {
          mockDate(2022, 4, 2, 16)
          expect(content.isCurrent()).to.eq(true)
        })
      }
    )

    context('when the current date is during the downtime', function () {
      it('returns true', function () {
        mockDate(2022, 4, 9, 17)
        expect(content.isCurrent()).to.eq(true)
      })
    })

    context(
      'when the current date is after the end of the downtime',
      function () {
        it('returns false', function () {
          mockDate(2022, 4, 9, 18)
          expect(content.isCurrent()).to.eq(false)
        })
      }
    )
  })

  describe('#isActive', function () {
    context(
      'when the current date is before the start of the downtime',
      function () {
        it('returns false', function () {
          mockDate(2022, 4, 9, 15, 59, 59)
          expect(content.isActive()).to.eq(false)
        })
      }
    )

    context('when the current date is during the downtime', function () {
      it('returns true', function () {
        mockDate(2022, 4, 9, 16)
        expect(content.isActive()).to.eq(true)

        mockDate(2022, 4, 9, 17, 59, 59)
        expect(content.isActive()).to.eq(true)
      })
    })

    context(
      'when the current date is after the end of the downtime',
      function () {
        it('returns false', function () {
          mockDate(2022, 4, 9, 18)
          expect(content.isActive()).to.eq(false)
        })
      }
    )
  })
})
