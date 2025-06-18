import { expect } from 'chai'
import sinon from 'sinon'

import { mockDate, unmockDate } from '../../../mocks/date'

import { DowntimeContent, DowntimeContentfulEntry, DowntimeService } from './downtime'
import * as contentful from 'contentful'

const formattedEntriesMockResponse = {
  bannerContent: {
    body: 'Some text briefly explaining the changes.',
    date: '3 March 2025',
  },

  posts: [
    {
      title: 'Whats new today!',
      body:
        '<h1 class="govuk-heading-xl govuk-!-margin-top-6">The latest updates and improvements to Book a secure' +
        ' move.</h1><h2 class="govuk-heading-l govuk-!-margin-top-5">Test heading 2.</h2><h3 class="govuk-heading-m' +
        ' govuk-!-margin-top-4"><em>Test heading 3.</em></h3><h4 class="govuk-heading-s govuk-!-margin-top-3">Test' +
        ' heading 4.</h4><a class="govuk-link" href="https://google.com">Test Link</a><p class="govuk-template__body">' +
        '<strong>Some random paragraph text.</strong></p><ul class="govuk-list govuk-list--bullet ' +
        'govuk-list-bullet-bottom-padding"><li><p class="govuk-template__body">TEST LINE 1</p></li><li><p class="govuk-template__body">' +
        'TEST LINE 2</p></li></ul><ol class="govuk-list govuk-list--number"><li><p class="govuk-template__body">TEST LINE 1' +
        '</p></li><li><p class="govuk-template__body">TEST LINE 2</p></li></ol><figure class="govuk-!-margin-top-6 ' +
        'govuk-!-margin-bottom-6"><img src="https://images.ctfassets.net/m5k1kmk3zqwh/4W3q8OwEoyEQxjJtdtCkbg/51b7fc' +
        '14e8d568d5f5314733e1b9aadb/image.png" alt="asset-test" /></figure>',
      date: '3 March 2025',
    },
  ],
}

describe('DowntimeService', function () {
  let service: DowntimeService

  beforeEach(function () {
    service = new DowntimeService()
    sinon.stub((service as any).client, 'getEntries').resolves({ items: [] })
    sinon.stub(service, 'fetch').resolves(formattedEntriesMockResponse)
  })

  afterEach(function () {
    unmockDate()
  })

  it('requests the right content type from Contentful', async function () {
    await (service as any).client.getEntries({ content_type: 'downtime' })

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
      sinon
        .stub(service, 'fetchPosts')
        .resolves(formattedEntriesMockResponse.posts)
    })

    it('only returns content that isActive', async function () {
      expect((await service.fetchPosts()).length).to.eq(1)
    })
  })

  describe('downtime response transformation', function () {
    it('transform downtime response to contentful content', async function () {

      const entries = {
        sys: {
          type: "Array"
        },
        total: 11,
        skip: 0,
        limit: 100,
        items: [
          {
            metadata: {
              tags: [],
              concepts: []
            },
            sys: {
              space: {
                sys: {
                  type: "Link",
                  linkType: "Space",
                  id: "m5k1kmk3zqwh"
                }
              },
              type: "Entry",
              id: "2dh8UdBv5meM7XUPuXfEsv",
              contentType: {
                sys: {
                  type: "Link",
                  linkType: "ContentType",
                  id: "downtime"
                }
              },
              revision: 0,
              createdAt: "2025-06-09T09:24:49.593Z",
              updatedAt: "2025-06-18T15:05:07.738Z",
              environment: {
                sys: {
                  id: "master",
                  type: "Link",
                  linkType: "Environment"
                }
              },
              locale: "en-US"
            },
            fields: {
              title: "Downtime testing",
              start: "2025-06-21T00:00+01:00",
              end: "2025-06-23T00:00+01:00",
              daysNotice: 7,
              briefBannerText: "this is to test the downtime banner "
            }
          },
          {
            metadata: {
              tags: [],
              concepts: []
            },
            sys: {
              space: {
                sys: {
                  type: "Link",
                  linkType: "Space",
                  id: "m5k1kmk3zqwh"
                }
              },
              type: "Entry",
              id: "p5N7muzUAijDCtwTiPEZO",
              contentType: {
                sys: {
                  type: "Link",
                  linkType: "ContentType",
                  id: "downtime"
                }
              },
              revision: 2,
              createdAt: "2024-06-25T16:04:10.810Z",
              updatedAt: "2024-12-30T11:33:06.665Z",
              firstPublishedAt: "2024-06-25T16:05:30.129Z",
              environment: {
                sys: {
                  id: "master",
                  type: "Link",
                  linkType: "Environment"
                }
              },
              locale: "en-US"
            },
            fields: {
              title: "The warning overview may contain inaccurate information",
              start: "2024-06-24T00:00+01:00",
              end: "2024-06-26T00:00+01:00",
              daysNotice: 4,
              briefBannerText: "How to update a move if a special vehicle is required"
            }
          }
        ]
      } as unknown as contentful.EntryCollection<DowntimeContentfulEntry>

      const transformedDowntimeContent = service.toDowntimeContent(entries)

      const content1: DowntimeContent = {
        date: new Date('2025-06-13T23:00:00.000Z'),
        title: '',
        body: 'You will be able to use the service again from 12am on Monday 23 June 2025.',
        bannerText: 'this is to test the downtime banner ',
        expiry: new Date('2025-06-22T23:00:00.000Z'),
        start: new Date('2025-06-20T23:00:00.000Z'),
        end: new Date('2025-06-22T23:00:00.000Z'),
        daysNotice: 7
      } as unknown as DowntimeContent

      const content2 = {
        date: new Date('2024-06-19T23:00:00.000Z'),
        title: '',
        body: 'You will be able to use the service again from 12am on Wednesday 26 June 2024.',
        bannerText: 'How to update a move if a special vehicle is required',
        expiry: new Date('2024-06-25T23:00:00.000Z'),
        start: new Date('2024-06-23T23:00:00.000Z'),
        end: new Date('2024-06-25T23:00:00.000Z'),
        daysNotice: 4
      } as unknown as DowntimeContent

      expect(JSON.stringify(transformedDowntimeContent)).eq(JSON.stringify([content1, content2]))
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
