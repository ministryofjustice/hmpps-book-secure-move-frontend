const proxyquire = require('proxyquire')

const assessmentToStartBannerStub = sinon
  .stub()
  .returns('__assessmentToStartBanner__')
const assessmentToUnconfirmedBannerStub = sinon
  .stub()
  .returns('__assessmentToUnconfirmedBanner__')

const presenter = proxyquire('./move-to-message-banner-component', {
  './assessment-to-start-banner': assessmentToStartBannerStub,
  './assessment-to-unconfirmed-banner': assessmentToUnconfirmedBannerStub,
})

describe('Presenters', function () {
  describe('Message banner presenters', function () {
    describe('#moveToMessageBannerComponent', function () {
      let output

      beforeEach(function () {
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
                    '__assessmentToUnconfirmedBanner__'
                  )
                })

                it('should call presenter', function () {
                  expect(
                    assessmentToUnconfirmedBannerStub
                  ).to.have.been.calledOnceWithExactly({
                    assessment: {
                      id: '12345',
                      status: 'confirmed',
                    },
                    baseUrl: '/move/12345/person-escort-record',
                    canAccess: mockArgs.canAccess,
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

        context('with youth move', function () {
          let mockMove

          beforeEach(function () {
            mockMove = {
              status: 'requested',
              profile: {
                requires_youth_risk_assessment: true,
              },
            }
          })

          context('with unconfirmed assessment', function () {
            beforeEach(function () {
              mockMove.profile.youth_risk_assessment = {
                id: '_youth_12345',
                status: 'in_progress',
              }
              mockMove.profile.person_escort_record = null

              output = presenter({
                ...mockArgs,
                move: mockMove,
              })
            })

            it('should return unconfirmed banner', function () {
              expect(output).to.deep.equal('__assessmentToUnconfirmedBanner__')
            })

            it('should call presenter', function () {
              expect(
                assessmentToUnconfirmedBannerStub
              ).to.have.been.calledOnceWithExactly({
                assessment: {
                  id: '_youth_12345',
                  status: 'in_progress',
                },
                baseUrl: '/move/12345/youth-risk-assessment',
                canAccess: mockArgs.canAccess,
                context: 'youth_risk_assessment',
              })
            })
          })

          context('with confirmed assessment', function () {
            beforeEach(function () {
              mockMove.profile.youth_risk_assessment = {
                id: '_youth_12345',
                status: 'confirmed',
              }
              mockMove.profile.person_escort_record = null

              output = presenter({
                ...mockArgs,
                move: mockMove,
              })
            })

            it('should return start PER banner', function () {
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

          context('when PER exists', function () {
            beforeEach(function () {
              mockMove.profile.youth_risk_assessment = null
              mockMove.profile.person_escort_record = {
                id: '_per_12345',
                status: 'in_progress',
              }

              output = presenter({
                ...mockArgs,
                move: mockMove,
              })
            })

            it('should return PER banner', function () {
              expect(output).to.deep.equal('__assessmentToUnconfirmedBanner__')
            })

            it('should call presenter', function () {
              expect(
                assessmentToUnconfirmedBannerStub
              ).to.have.been.calledOnceWithExactly({
                assessment: {
                  id: '_per_12345',
                  status: 'in_progress',
                },
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
