const middleware = require('./redirect-base-url')

describe('Moves middleware', function () {
  describe('#redirectBaseUrl()', function () {
    const mockMoveDate = '2019-10-10'
    let req, res

    beforeEach(function () {
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      req = {
        baseUrl: '/moves',
        session: {},
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
          context('when the location type is prison', function () {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'prison',
            }

            beforeEach(function () {
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: [],
                },
              }

              middleware(req, res)
            })

            it('should redirect to outgoing moves by location', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
              )
            })
          })
          context('when the location type is police', function () {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'police',
            }

            beforeEach(function () {
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: [],
                },
              }

              middleware(req, res)
            })

            it('should redirect to outgoing moves by location', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
              )
            })
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
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: ['moves:view:proposed'],
                },
              }

              middleware(req, res)
            })
            it('should redirect to the dashboard if the user can see them', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/week/${mockMoveDate}/${mockLocation.id}/requested`
              )
            })
          })
          context('when location type is not prison', function () {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'police',
            }

            beforeEach(function () {
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: ['moves:view:proposed'],
                },
              }

              middleware(req, res)
            })
            it('should redirect to the outgoing move view by day', function () {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
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
          it('should redirect to moves without location', function () {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/day/${mockMoveDate}/outgoing`
            )
          })
        }
      )
      context(
        'when user has permission to see the proposed moves',
        function () {
          beforeEach(function () {
            req.session = {
              user: {
                permissions: ['move:proposed:view'],
              },
            }
            res.redirect.resetHistory()
            middleware(req, res)
          })
          it('should redirect to moves without location', function () {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/day/${mockMoveDate}/outgoing`
            )
          })
        }
      )
    })
  })
})
