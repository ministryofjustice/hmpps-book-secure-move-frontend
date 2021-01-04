const middleware = require('./redirect-base-url')

describe('Moves middleware', function () {
  describe('#redirectBaseUrl()', function () {
    const mockMoveDate = '2019-10-10'
    let req, res

    beforeEach(function () {
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      req = {
        baseUrl: '/moves',
        canAccess: sinon.stub().returns(false),
      }
      res = {
        redirect: sinon.stub(),
      }
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('with current location', function () {
      context(
        "when user hasn't got permission to see the proposed moves",
        function () {
          const mockLocation = {
            id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
            location_type: 'prison',
          }

          beforeEach(function () {
            req.session = {
              currentLocation: mockLocation,
            }

            middleware(req, res)
          })

          it('should redirect to outgoing moves by location', function () {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              '/moves/outgoing'
            )
          })
        }
      )

      context(
        'when user has permission to see the proposed moves',
        function () {
          context('when location type is prison', function () {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'prison',
            }

            beforeEach(function () {
              req.canAccess.withArgs('moves:view:proposed').returns(true)
              req.session = {
                currentLocation: mockLocation,
              }

              middleware(req, res)
            })

            it('should redirect to requested route', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                '/moves/requested'
              )
            })
          })

          context('when location type is not prison', function () {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'police',
            }

            beforeEach(function () {
              req.canAccess.withArgs('moves:view:proposed').returns(true)
              req.session = {
                currentLocation: mockLocation,
              }

              middleware(req, res)
            })
            it('should redirect to outgoing moves', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                '/moves/outgoing'
              )
            })
          })
        }
      )
    })

    context('without current location', function () {
      beforeEach(function () {
        middleware(req, res)
      })

      context(
        "when user hasn't got permission to see the proposed moves",
        function () {
          it('should redirect to outgoing moves', function () {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              '/moves/outgoing'
            )
          })
        }
      )

      context(
        'when user has permission to see the proposed moves',
        function () {
          beforeEach(function () {
            req.canAccess.withArgs('move:proposed:view').returns(true)
            res.redirect.resetHistory()
            middleware(req, res)
          })

          it('should redirect to outgoing moves', function () {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              '/moves/outgoing'
            )
          })
        }
      )
    })
  })
})
