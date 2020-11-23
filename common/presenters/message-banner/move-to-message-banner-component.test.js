const proxyquire = require('proxyquire')

const assessmentToConfirmedBannerStub = sinon
  .stub()
  .returns('__assessmentToConfirmedBanner__')
const assessmentToStartBannerStub = sinon
  .stub()
  .returns('__assessmentToStartBanner__')
const assessmentToUnconfirmedBannerStub = sinon
  .stub()
  .returns('__assessmentToUnconfirmedBanner__')

const presenter = proxyquire('./move-to-message-banner-component', {
  './assessment-to-confirmed-banner': assessmentToConfirmedBannerStub,
  './assessment-to-start-banner': assessmentToStartBannerStub,
  './assessment-to-unconfirmed-banner': assessmentToUnconfirmedBannerStub,
})

describe('Presenters', function () {
  describe('Message banner presenters', function () {
    describe('#moveToMessageBannerComponent', function () {
      let output

      beforeEach(function () {
        assessmentToConfirmedBannerStub.resetHistory()
        assessmentToStartBannerStub.resetHistory()
        assessmentToUnconfirmedBannerStub.resetHistory()
      })

      context('without args', function () {
        it('should return undefined', function () {
          output = presenter()
          expect(output).to.be.undefined
        })
      })

      context('with args', function () {
        const mockArgs = {
          move: {},
          moveUrl: '/move/12345',
          canAccess: sinon.stub(),
        }

        context('with proposed moves', function () {
          it('should return undefined', function () {
            output = presenter({
              move: {
                status: 'proposed',
              },
            })
            expect(output).to.be.undefined
          })
        })

        context('without profile', function () {
          it('should return undefined', function () {
            output = presenter({
              move: {
                status: 'requested',
              },
            })
            expect(output).to.be.undefined
          })
        })

        const activeStatuses = ['requested', 'booked']
        activeStatuses.forEach(status => {
          context(`with '${status}' move`, function () {
            let mockMove
            beforeEach(function () {
              mockMove = {
                status,
              }
            })

            context('with assessment', function () {
              context('with confirmed assessment', function () {
                beforeEach(function () {
                  output = presenter({
                    ...mockArgs,
                    move: {
                      ...mockMove,
                      profile: {
                        person_escort_record: {
                          id: '12345',
                          status: 'confirmed',
                        },
                      },
                    },
                  })
                })

                it('should return unconfirmed banner', function () {
                  expect(output).to.deep.equal(
                    '__assessmentToConfirmedBanner__'
                  )
                })

                it('should call presenter', function () {
                  expect(
                    assessmentToConfirmedBannerStub
                  ).to.have.been.calledOnceWithExactly({
                    assessment: {
                      id: '12345',
                      status: 'confirmed',
                    },
                    baseUrl: '/move/12345/person-escort-record',
                    context: 'person_escort_record',
                  })
                })
              })

              context('with unconfirmed assessment', function () {
                beforeEach(function () {
                  output = presenter({
                    ...mockArgs,
                    move: {
                      ...mockMove,
                      profile: {
                        person_escort_record: {
                          id: '12345',
                          status: 'completed',
                        },
                      },
                    },
                  })
                })

                it('should return unconfirmed banner', function () {
                  expect(output).to.deep.equal(
                    '__assessmentToUnconfirmedBanner__'
                  )
                })

                it('should call presenter', function () {
                  expect(
                    assessmentToUnconfirmedBannerStub
                  ).to.have.been.calledOnceWithExactly({
                    assessment: {
                      id: '12345',
                      status: 'completed',
                    },
                    baseUrl: '/move/12345/person-escort-record',
                    canAccess: mockArgs.canAccess,
                    context: 'person_escort_record',
                  })
                })
              })
            })

            context('with empty assessment', function () {
              beforeEach(function () {
                output = presenter({
                  ...mockArgs,
                  move: {
                    ...mockMove,
                    profile: {
                      person_escort_record: {},
                    },
                  },
                })
              })

              it('should return start banner', function () {
                expect(output).to.deep.equal('__assessmentToStartBanner__')
              })

              it('should call presenter', function () {
                expect(
                  assessmentToStartBannerStub
                ).to.have.been.calledOnceWithExactly({
                  baseUrl: '/move/12345/person-escort-record',
                  canAccess: mockArgs.canAccess,
                  context: 'person_escort_record',
                })
              })
            })
          })
        })
      })
    })
  })
})
