const i18n = require('../../../config/i18n').default

const middleware = require('./set-filter.allocations')

const mockConfig = [
  {
    status: 'pending',
    label: 'statuses::pending',
  },
  {
    status: 'approved',
    label: 'statuses::approved',
  },
  {
    status: 'rejected',
    label: 'statuses::rejected',
  },
]

describe('Allocations middleware', function () {
  describe('#setfilterAllocations()', function () {
    let next
    let req
    let res
    let allocationService

    context('when service resolves', function () {
      const mockDateRange = ['2010-09-03', '2010-09-10']
      const mockLocationId = '123'

      beforeEach(function () {
        allocationService = {
          getByDateAndLocation: sinon.stub().resolves(4),
        }
        sinon.stub(i18n, 't').returnsArg(0)
        next = sinon.spy()
        req = {
          baseUrl: '/moves',
          path: '/week/2010-09-07/123',
          body: {
            allocations: {
              createdAtDate: mockDateRange,
              fromLocationId: mockLocationId,
              status: 'pending',
            },
          },
          services: {
            allocation: allocationService,
          },
        }
        res = {}
      })

      context('without custom href', function () {
        beforeEach(async function () {
          await middleware(mockConfig)(req, res, next)
        })

        it('sets req.filter', function () {
          expect(req.filter).to.deep.equal([
            {
              active: true,
              label: 'statuses::pending',
              href: '/moves/week/2010-09-07/123?status=pending',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::approved',
              href: '/moves/week/2010-09-07/123?status=approved',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::rejected',
              href: '/moves/week/2010-09-07/123?status=rejected',
              value: 4,
            },
          ])
        })

        it('calls the servive with correct arguments', function () {
          expect(
            allocationService.getByDateAndLocation
          ).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'pending',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
          expect(
            allocationService.getByDateAndLocation
          ).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'approved',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
          expect(
            allocationService.getByDateAndLocation
          ).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'rejected',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
        })

        it('calls the service on each item', function () {
          expect(allocationService.getByDateAndLocation.callCount).to.equal(3)
        })

        it('translate each item', function () {
          expect(i18n.t.callCount).to.equal(3)
        })

        it('translates with count', function () {
          expect(i18n.t).to.be.calledWithExactly('statuses::pending', {
            count: 4,
          })
          expect(i18n.t).to.be.calledWithExactly('statuses::approved', {
            count: 4,
          })
          expect(i18n.t).to.be.calledWithExactly('statuses::rejected', {
            count: 4,
          })
        })

        it('calls next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('with custom href', function () {
        beforeEach(async function () {
          await middleware([
            {
              status: 'pending',
              label: 'statuses::pending',
              href: '/custom/pending',
            },
            {
              status: 'approved',
              label: 'statuses::approved',
              href: '/custom/approved',
            },
            {
              status: 'rejected',
              label: 'statuses::rejected',
              href: '/custom/rejected',
            },
          ])(req, res, next)
        })

        it('should use custom path in URLs req.filter', function () {
          expect(req.filter).to.deep.equal([
            {
              active: true,
              label: 'statuses::pending',
              href: '/custom/pending?status=pending',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::approved',
              href: '/custom/approved?status=approved',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::rejected',
              href: '/custom/rejected?status=rejected',
              value: 4,
            },
          ])
        })

        it('calls next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('with existing query', function () {
        beforeEach(async function () {
          req.query = {
            foo: 'bar',
          }
          await middleware(mockConfig)(req, res, next)
        })

        it('should combine query in URLs', function () {
          expect(req.filter).to.deep.equal([
            {
              active: true,
              label: 'statuses::pending',
              href: '/moves/week/2010-09-07/123?foo=bar&status=pending',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::approved',
              href: '/moves/week/2010-09-07/123?foo=bar&status=approved',
              value: 4,
            },
            {
              active: false,
              label: 'statuses::rejected',
              href: '/moves/week/2010-09-07/123?foo=bar&status=rejected',
              value: 4,
            },
          ])
        })

        it('calls next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('with existing query containing `page`', function () {
        beforeEach(async function () {
          req.query = {
            foo: 'bar',
            page: 3,
          }
          await middleware(mockConfig)(req, res, next)
        })

        it('should remove page from each link', function () {
          const links = req.filter.map(item => item.href)
          expect(links).to.deep.equal([
            '/moves/week/2010-09-07/123?foo=bar&status=pending',
            '/moves/week/2010-09-07/123?foo=bar&status=approved',
            '/moves/week/2010-09-07/123?foo=bar&status=rejected',
          ])
        })
      })
    })

    context('when service fails', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        allocationService.getByDateAndLocation = sinon.stub().rejects(mockError)
        next = sinon.spy()
        req = {
          body: {},
          params: {},
          services: {
            allocation: allocationService,
          },
        }

        await middleware(mockConfig)(req, {}, next)
      })

      it('calls next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
