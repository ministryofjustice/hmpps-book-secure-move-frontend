const singleRequestService = require('../../../common/services/single-request')
const i18n = require('../../../config/i18n')

const middleware = require('./set-filter.single-requests')

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

describe('Moves middleware', function () {
  describe('#setfilterSingleRequests()', function () {
    let next
    let req
    let res

    context('when service resolves', function () {
      const mockDateRange = ['2010-09-03', '2010-09-10']
      const mockLocationId = '123'

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(singleRequestService, 'getAll').resolves(4)
        next = sinon.spy()
        req = {
          baseUrl: '/moves',
          path: '/week/2010-09-07/123',
          body: {
            requested: {
              createdAtDate: mockDateRange,
              fromLocationId: mockLocationId,
              status: 'pending',
            },
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

        it('calls the servive with correct arguments', async function () {
          expect(singleRequestService.getAll).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'pending',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
          expect(singleRequestService.getAll).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'approved',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
          expect(singleRequestService.getAll).to.have.been.calledWithExactly({
            isAggregation: true,
            status: 'rejected',
            createdAtDate: mockDateRange,
            fromLocationId: mockLocationId,
          })
        })

        it('calls the service on each item', async function () {
          expect(singleRequestService.getAll.callCount).to.equal(3)
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
    })

    context('when service fails', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        sinon.stub(singleRequestService, 'getAll').rejects(mockError)
        next = sinon.spy()
        req = {
          params: {},
        }

        await middleware(mockConfig)(req, {}, next)
      })

      it('calls next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
