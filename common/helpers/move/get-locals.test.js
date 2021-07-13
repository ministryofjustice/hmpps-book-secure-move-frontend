const proxyquire = require('proxyquire').noCallThru()

const personToSummaryListComponent = sinon.stub().returnsArg(0)
const moveToAdditionalInfoListComponent = sinon
  .stub()
  .returns('__moveToAdditionalInfoListComponent__')
const moveToMetaListComponent = sinon
  .stub()
  .returns('__moveToMetaListComponent__')

const presenters = {
  personToSummaryListComponent,
  moveToAdditionalInfoListComponent,
  moveToMetaListComponent,
}

const mockUpdateUrls = {
  stepOne: '/',
  stepTwo: '/step-two',
  stepThree: '/step-three',
}
const getAssessments = sinon.stub().returns({ assessments: '__assessments__' })
const getCourtHearings = sinon.stub().returns({ content: '__court-hearings__' })
const getMessage = sinon.stub().returns({
  messageTitle: '__message-title__',
  messageContent: '__message-content__',
})
const getMessageBanner = sinon.stub().returns({ content: '__message-banner__' })
const getPerDetails = sinon.stub().returns({ perDetails: '__per-details__' })
const getTabsUrls = sinon.stub().returns('__tabs-urls__')
const getTagLists = sinon.stub().returns({ tagLists: '__tag-lists__' })
const getUpdateUrls = sinon.stub().returns(mockUpdateUrls)
const mapUpdateLink = sinon.stub().returnsArg(0)

const pathStubs = {
  '../../presenters': presenters,
  './get-assessments': getAssessments,
  './get-court-hearings': getCourtHearings,
  './get-message': getMessage,
  './get-message-banner': getMessageBanner,
  './get-per-details': getPerDetails,
  './get-tabs-urls': getTabsUrls,
  './get-tag-lists': getTagLists,
  './get-update-urls': getUpdateUrls,
  './map-update-link': mapUpdateLink,
}

const getLocals = proxyquire('./get-locals', pathStubs)

const mockAssessmentAnswers = []

const mockPerson = {
  id: 'personId',
}
const mockProfile = {
  assessment_answers: mockAssessmentAnswers,
  person: mockPerson,
  category: '__mock-category__',
}
const mockMove = {
  id: 'moveId',
  status: 'requested',
  profile: mockProfile,
}

describe('Move helpers', function () {
  describe('#getLocals()', function () {
    let req
    let params
    const userPermissions = ['permA']
    let canAccess

    beforeEach(function () {
      getAssessments.resetHistory()
      getCourtHearings.resetHistory()
      getMessage.resetHistory()
      getMessageBanner.resetHistory()
      getPerDetails.resetHistory()
      getTagLists.resetHistory()
      getTabsUrls.resetHistory()
      getUpdateUrls.resetHistory()
      mapUpdateLink.resetHistory()
      personToSummaryListComponent.resetHistory()
      moveToAdditionalInfoListComponent.resetHistory()
      moveToMetaListComponent.resetHistory()
      canAccess = sinon.stub().returns(true)

      req = {
        t: sinon.stub().returnsArg(0),
        canAccess,
        session: {
          user: {
            permissions: userPermissions,
          },
        },
        move: mockMove,
      }
    })

    context('by default', function () {
      beforeEach(function () {
        params = getLocals(req)
      })

      describe('move', function () {
        it('should set the move param', function () {
          expect(params).to.have.property('move')
          expect(params.move).to.deep.equal(mockMove)
        })
      })

      describe('move summary', function () {
        it('should get the move summary', function () {
          expect(moveToMetaListComponent).to.be.calledOnceWithExactly(
            mockMove,
            {
              updateUrls: mockUpdateUrls,
              showPerson: false,
            }
          )
        })

        it('should set the move summary param', function () {
          expect(params).to.have.property('moveSummary')
          expect(params.moveSummary).to.equal('__moveToMetaListComponent__')
        })
      })

      describe('personal details', function () {
        const mockPersonWithProfileCategory = {
          ...mockPerson,
          category: '__mock-category__',
        }
        it('should get the personal details summary', function () {
          expect(personToSummaryListComponent).to.be.calledOnceWithExactly(
            mockPersonWithProfileCategory
          )
        })
        it('should set the personal details summary param', function () {
          expect(params).to.have.property('personalDetailsSummary')
          expect(params.personalDetailsSummary).to.deep.equal(
            mockPersonWithProfileCategory
          )
        })
      })

      describe('additonal info', function () {
        it('should ge the additonal info summary', function () {
          expect(moveToAdditionalInfoListComponent).to.be.calledOnceWithExactly(
            mockMove
          )
        })

        it('should set the additional info summary param', function () {
          expect(params).to.have.property('additionalInfoSummary')
          expect(params.additionalInfoSummary).to.equal(
            '__moveToAdditionalInfoListComponent__'
          )
        })
      })

      describe('assessments', function () {
        it('should get the assessments', function () {
          expect(getAssessments).to.be.calledOnceWithExactly(mockMove)
        })

        it('should set the assessments param', function () {
          expect(params.assessments).to.equal('__assessments__')
        })
      })

      describe('tag lists', function () {
        it('should get the tag lists', function () {
          expect(getTagLists).to.be.calledOnceWithExactly(mockMove)
        })

        it('should set the tag list param', function () {
          expect(params.tagLists).to.equal('__tag-lists__')
        })
      })

      describe('Person Escort Record (PER) details', function () {
        it('should get the PER details', function () {
          expect(getPerDetails).to.be.calledOnceWithExactly(mockMove)
        })

        it('should set the PER details params', function () {
          expect(params.perDetails).to.deep.equal('__per-details__')
        })
      })

      describe('court hearings', function () {
        it('should get the court hearings', function () {
          expect(getCourtHearings).to.be.calledOnceWithExactly(mockMove)
        })

        it('should set the court hearings param', function () {
          expect(params.courtHearings).to.deep.equal({
            content: '__court-hearings__',
          })
        })
      })

      describe('message', function () {
        it('should get the message', function () {
          expect(getMessage).to.be.calledOnceWithExactly(mockMove)
        })

        it('should set the message title param', function () {
          expect(params.messageTitle).to.equal('__message-title__')
        })

        it('should set the message content param', function () {
          expect(params.messageContent).to.equal('__message-content__')
        })
      })

      describe('message banner', function () {
        it('should get the message banner', function () {
          expect(getMessageBanner).to.be.calledOnceWithExactly(
            mockMove,
            canAccess
          )
        })

        it('should set the message title param', function () {
          expect(params.messageBanner).to.deep.equal({
            content: '__message-banner__',
          })
        })
      })

      describe('tabs urls', function () {
        it('should call getTabsUrls with expected args', function () {
          expect(getTabsUrls).to.be.calledOnceWithExactly(mockMove)
        })

        it('should pass tabs urls in locals to render', function () {
          expect(params.urls).to.have.property('tabs')
        })

        it('should pass tabs links in locals to render', function () {
          expect(params.urls.tabs).to.deep.equal('__tabs-urls__')
        })
      })

      describe('update urls and links', function () {
        it('should call getUpdateUrls with expected args', function () {
          expect(getUpdateUrls).to.be.calledOnceWithExactly(mockMove, canAccess)
        })

        it('should call mapUpdateLink helper', function () {
          expect(mapUpdateLink.callCount).to.equal(
            Object.keys(mockUpdateUrls).length
          )
        })

        it('should pass update urls in locals to render', function () {
          expect(params.urls).to.have.property('update')
        })

        it('should pass update links in locals to render', function () {
          expect(params.updateLinks).to.deep.equal(mockUpdateUrls)
        })
      })
    })

    context('when move doesn’t have a person', function () {
      let params

      beforeEach(function () {
        req.move = {
          id: 'moveId',
          status: 'requested',
          profile: {
            ...mockProfile,
            person: undefined,
          },
        }

        params = getLocals(req)
      })

      it('should call personToSummaryListComponent presenter with undefined', function () {
        expect(personToSummaryListComponent).to.be.calledOnceWithExactly(
          undefined
        )
      })

      it('should set the undefined personal details summary param', function () {
        expect(params).to.have.property('personalDetailsSummary')
        expect(params.personalDetailsSummary).to.equal(undefined)
      })
    })

    context('when move doesn’t have a profile', function () {
      let params

      beforeEach(function () {
        req.move = {
          id: 'moveId',
          status: 'requested',
        }

        params = getLocals(req)
      })

      it('should still return the expected locals', function () {
        expect(Object.keys(params).sort()).to.deep.equal([
          'additionalInfoSummary',
          'assessments',
          'canCancelMove',
          'courtHearings',
          'messageBanner',
          'messageContent',
          'messageTitle',
          'move',
          'moveSummary',
          'perDetails',
          'personalDetailsSummary',
          'tagLists',
          'updateLinks',
          'urls',
        ])
      })
    })

    context('when move profile is null', function () {
      let params

      beforeEach(function () {
        req.move = {
          id: 'moveId',
          status: 'requested',
          profile: null,
        }

        params = getLocals(req)
      })

      it('should still return the expected locals', function () {
        expect(Object.keys(params).sort()).to.deep.equal([
          'additionalInfoSummary',
          'assessments',
          'canCancelMove',
          'courtHearings',
          'messageBanner',
          'messageContent',
          'messageTitle',
          'move',
          'moveSummary',
          'perDetails',
          'personalDetailsSummary',
          'tagLists',
          'updateLinks',
          'urls',
        ])
      })
    })

    describe('cancelling a move', function () {
      let params

      beforeEach(function () {
        req.move = {
          ...mockMove,
          person: undefined,
        }
      })

      context('with proposed state', function () {
        beforeEach(function () {
          req.move = {
            ...req.move,
            status: 'proposed',
          }
        })

        context('without permission to cancel proposed moves', function () {
          beforeEach(function () {
            params = getLocals(req)
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })

        context('with permission to cancel proposed moves', function () {
          beforeEach(function () {
            req.session.user.permissions = ['move:cancel:proposed']

            params = getLocals(req)
          })

          it('should be able to cancel move', function () {
            expect(params.canCancelMove).to.be.true
          })
        })
      })

      const cancellableStates = ['requested', 'booked']
      cancellableStates.forEach(status => {
        context(`with ${status} state`, function () {
          beforeEach(function () {
            req.move = {
              ...req.move,
              status,
            }
          })

          context('allocation move', function () {
            beforeEach(function () {
              req.move = {
                ...req.move,
                allocation: {
                  id: '123',
                },
              }
            })

            context('without permission to cancel move', function () {
              beforeEach(function () {
                params = getLocals(req)
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })

            context('with permission to cancel move', function () {
              beforeEach(function () {
                req.session.user.permissions = ['move:cancel']
                params = getLocals(req)
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })
          })

          context('non-allocation move', function () {
            context('without permission to cancel move', function () {
              beforeEach(function () {
                params = getLocals(req)
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })

            context('with permission to cancel move', function () {
              beforeEach(function () {
                req.session.user.permissions = ['move:cancel']
                params = getLocals(req)
              })

              it('should be able to cancel move', function () {
                expect(params.canCancelMove).to.be.true
              })
            })
          })
        })
      })

      context('with other state', function () {
        beforeEach(function () {
          req.move = {
            ...req.move,
            status: 'completed',
          }
        })

        context('without permission to cancel move', function () {
          beforeEach(function () {
            params = getLocals(req)
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })

        context('with permission to cancel move', function () {
          beforeEach(function () {
            req.session.user.permissions = ['move:cancel']
            params = getLocals(req)
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })
      })
    })
  })
})
