const i18n = require('../../../config/i18n')

const middleware = require('./set-filter.moves')

const mockBodyKey = 'bodyKey'
const mockConfig = [
  {
    label: 'statuses::pending',
  },
  {
    label: 'statuses::approved',
  },
  {
    label: 'statuses::rejected',
  },
]

describe('Moves middleware', function () {
  describe('#setFilterMoves()', function () {
    let next
    let req
    let res
    let moveService

    context('when service resolves', function () {
      const mockDateRange = ['2010-09-03', '2010-09-10']
      const mockLocationId = '123'

      beforeEach(function () {
        moveService = {
          getActive: sinon.stub().resolves(4),
        }
        sinon.stub(i18n, 't').returnsArg(0)
        next = sinon.spy()
        req = {
          baseUrl: '/moves',
          path: '/week/2010-09-07/123',
          body: {
            [mockBodyKey]: {
              createdAtDate: mockDateRange,
              fromLocationId: mockLocationId,
            },
          },
          services: {
            move: moveService,
          },
        }
        res = {}
      })

      context('without custom href', function () {
        beforeEach(async function () {
          await middleware(mockConfig, mockBodyKey)(req, res, next)
        })

        it('sets req.filter', function () {
          const filter = [
            {
              label: 'statuses::pending',
              href: '/moves/week/2010-09-07/123?',
              value: 4,
            },
            {
              label: 'statuses::approved',
              href: '/moves/week/2010-09-07/123?',
              value: 4,
            },
            {
              label: 'statuses::rejected',
              href: '/moves/week/2010-09-07/123?',
              value: 4,
            },
          ]
          expect(req.filter).to.deep.equal(filter)
          expect(req.filterBodyKey).to.deep.equal(filter)
        })

        it('calls the servive with correct arguments', async function () {
          expect(moveService.getActive).to.have.been.calledWithExactly({
            ...req.body[mockBodyKey],
            isAggregation: true,
          })
          expect(moveService.getActive).to.have.been.calledWithExactly({
            ...req.body[mockBodyKey],
            isAggregation: true,
          })
          expect(moveService.getActive).to.have.been.calledWithExactly({
            ...req.body[mockBodyKey],
            isAggregation: true,
          })
        })

        it('calls the service on each item', async function () {
          expect(moveService.getActive.callCount).to.equal(3)
        })

        it('calls next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('with custom href', function () {
        beforeEach(async function () {
          await middleware(
            [
              {
                label: 'statuses::pending',
                href: '/custom/pending',
              },
              {
                label: 'statuses::approved',
                href: '/custom/approved',
              },
              {
                label: 'statuses::rejected',
                href: '/custom/rejected',
              },
            ],
            mockBodyKey
          )(req, res, next)
        })

        it('should use custom path in URLs req.filter', function () {
          const filter = [
            {
              label: 'statuses::pending',
              href: '/custom/pending?',
              value: 4,
            },
            {
              label: 'statuses::approved',
              href: '/custom/approved?',
              value: 4,
            },
            {
              label: 'statuses::rejected',
              href: '/custom/rejected?',
              value: 4,
            },
          ]
          expect(req.filter).to.deep.equal(filter)
          expect(req.filterBodyKey).to.deep.equal(filter)
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
          await middleware(mockConfig, mockBodyKey)(req, res, next)
        })

        it('should combine query in URLs', function () {
          const filter = [
            {
              label: 'statuses::pending',
              href: '/moves/week/2010-09-07/123?foo=bar',
              value: 4,
            },
            {
              label: 'statuses::approved',
              href: '/moves/week/2010-09-07/123?foo=bar',
              value: 4,
            },
            {
              label: 'statuses::rejected',
              href: '/moves/week/2010-09-07/123?foo=bar',
              value: 4,
            },
          ]
          expect(req.filter).to.deep.equal(filter)
          expect(req.filterBodyKey).to.deep.equal(filter)
        })

        it('calls next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })
    })

    context('when service fails', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        next = sinon.spy()
        req = {
          params: {},
          services: {
            move: {
              getActive: sinon.stub().rejects(mockError),
            },
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
