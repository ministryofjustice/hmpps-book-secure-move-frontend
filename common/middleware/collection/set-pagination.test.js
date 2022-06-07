const i18n = require('../../../config/i18n').default
const urlHelpers = require('../../helpers/url')

const middleware = require('./set-pagination')

const mockRoute = '/mock-route'

describe('Moves middleware', function () {
  describe('#setPagination()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(urlHelpers, 'compileFromRoute').returnsArg(0)
      mockReq = {
        query: {},
      }
      nextSpy = sinon.spy()
    })

    context('without results', function () {
      beforeEach(function () {
        middleware()(mockReq, {}, nextSpy)
      })

      it('should not set pagination', function () {
        expect(mockReq).not.to.have.property('pagination')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with results', function () {
      context('with one page', function () {
        beforeEach(function () {
          mockReq.results = {
            meta: {
              pagination: {
                total_pages: 1,
              },
            },
          }
          middleware(mockRoute)(mockReq, {}, nextSpy)
        })

        it('should not set pagination', function () {
          expect(mockReq).not.to.have.property('pagination')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with more than one page', function () {
        context('with previous page', function () {
          beforeEach(function () {
            mockReq.query.page = 2
            mockReq.results = {
              meta: {
                pagination: {
                  total_pages: 3,
                },
              },
              links: {
                prev: '/route?page=1',
                next: null,
              },
            }
            middleware(mockRoute)(mockReq, {}, nextSpy)
          })

          it('should set pagination', function () {
            expect(mockReq).to.have.property('pagination')
            expect(mockReq.pagination).deep.equal({
              next: undefined,
              previous: {
                href: `${mockRoute}`,
                label: 'pagination.page_of',
                text: 'pagination.previous_page',
              },
            })
          })

          it('should use the correct page numbers', function () {
            expect(urlHelpers.compileFromRoute.args[0][3]).to.deep.equal({
              page: '1',
            })
            expect(i18n.t).to.be.calledWithExactly('pagination.page_of', {
              current: 1,
              total: mockReq.results.meta.pagination.total_pages,
            })
          })

          it('should use route to compile href', function () {
            expect(urlHelpers.compileFromRoute.args[0][0]).to.equal(mockRoute)
          })

          it('should use req to compile href', function () {
            expect(urlHelpers.compileFromRoute.args[0][1]).to.deep.equal(
              mockReq
            )
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with next page', function () {
          beforeEach(function () {
            mockReq.results = {
              meta: {
                pagination: {
                  total_pages: 3,
                },
              },
              links: {
                next: '/route?page=2',
                prev: null,
              },
            }
            middleware(mockRoute)(mockReq, {}, nextSpy)
          })

          it('should set pagination', function () {
            expect(mockReq).to.have.property('pagination')
            expect(mockReq.pagination).deep.equal({
              previous: undefined,
              next: {
                href: `${mockRoute}`,
                label: 'pagination.page_of',
                text: 'pagination.next_page',
              },
            })
          })

          it('should use the correct page numbers', function () {
            expect(urlHelpers.compileFromRoute.args[0][3]).to.deep.equal({
              page: '2',
            })
            expect(i18n.t).to.be.calledWithExactly('pagination.page_of', {
              current: 2,
              total: mockReq.results.meta.pagination.total_pages,
            })
          })

          it('should use route to compile href', function () {
            expect(urlHelpers.compileFromRoute.args[0][0]).to.equal(mockRoute)
          })

          it('should use req to compile href', function () {
            expect(urlHelpers.compileFromRoute.args[0][1]).to.deep.equal(
              mockReq
            )
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })
  })
})
