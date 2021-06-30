const presenters = require('../../../../../common/presenters')

const middleware = require('./locals.warnings')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsWarnings()', function () {
      let req, res, nextSpy, frameworkSectionStub

      beforeEach(function () {
        frameworkSectionStub = sinon.stub().returnsArg(0)
        sinon
          .stub(presenters, 'frameworkFlagsToTagList')
          .returns('__frameworkFlagsToTagList__')
        sinon
          .stub(presenters, 'frameworkSectionToPanelList')
          .returns(frameworkSectionStub)
        sinon.stub(presenters, 'assessmentAnswersByCategory').returnsArg(0)
        sinon
          .stub(presenters, 'assessmentCategoryToPanelComponent')
          .returnsArg(0)

        req = {
          move: {
            id: 'moveId',
            status: 'requested',
            profile: {
              assessment_answers: [],
            },
          },
          baseUrl: '/base-url',
          originalUrl: '/original-url',
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      describe('sections', function () {
        context('with Person Escort Record', function () {
          beforeEach(function () {
            req.move.profile.person_escort_record = {
              _framework: {
                sections: [
                  { name: 'foo', order: 2 },
                  { name: 'bar', order: 1 },
                ],
              },
              id: 'per_12345',
            }
            middleware(req, res, nextSpy)
          })

          it('should call frameworkSectionToPanelList presenter for each section', function () {
            expect(frameworkSectionStub.callCount).to.equal(2)
            expect(presenters.frameworkSectionToPanelList).to.be.calledTwice
            expect(presenters.frameworkSectionToPanelList).to.be.calledWith({
              baseUrl: `/move/${req.move.id}/person-escort-record`,
            })
          })

          it('should set sections variable to PER sections correctly ordered', function () {
            expect(res.locals.warnings).to.have.property('sections')
            expect(res.locals.warnings.sections).to.deep.equal([
              { name: 'bar', order: 1 },
              { name: 'foo', order: 2 },
            ])
          })
        })

        context('with Youth Risk Assessment', function () {
          beforeEach(function () {
            req.move.profile.requires_youth_risk_assessment = true
            req.move.profile.youth_risk_assessment = {
              _framework: {
                sections: [
                  { name: 'fizz', order: 2 },
                  { name: 'buzz', order: 1 },
                ],
              },
              id: 'yra_12345',
            }
          })

          context('with Person Escort Record', function () {
            beforeEach(function () {
              req.move.profile.person_escort_record = {
                _framework: {
                  sections: [
                    { name: 'foo', order: 2 },
                    { name: 'bar', order: 1 },
                  ],
                },
                id: 'per_12345',
              }
              middleware(req, res, nextSpy)
            })

            it('should call frameworkSectionToPanelList presenter for each section', function () {
              expect(frameworkSectionStub.callCount).to.equal(4)
              expect(presenters.frameworkSectionToPanelList).to.be.calledTwice
              expect(presenters.frameworkSectionToPanelList).to.be.calledWith({
                baseUrl: `/move/${req.move.id}/person-escort-record`,
              })
            })

            it('should set sections variable to PER sections correctly ordered', function () {
              expect(res.locals.warnings).to.have.property('sections')
              expect(res.locals.warnings.sections).to.deep.equal([
                { name: 'bar', order: 1 },
                { name: 'foo', order: 2 },
              ])
            })
          })

          context('without Person Escort Record', function () {
            beforeEach(function () {
              middleware(req, res, nextSpy)
            })

            it('should call frameworkSectionToPanelList presenter for each section', function () {
              expect(frameworkSectionStub.callCount).to.equal(2)
              expect(presenters.frameworkSectionToPanelList).to.be.calledTwice
              expect(presenters.frameworkSectionToPanelList).to.be.calledWith({
                baseUrl: `/move/${req.move.id}/person-escort-record`,
              })
              expect(presenters.frameworkSectionToPanelList).to.be.calledWith({
                baseUrl: `/move/${req.move.id}/youth-risk-assessment`,
              })
            })

            it('should set sections variable to YRA sections correctly ordered', function () {
              expect(res.locals.warnings).to.have.property('sections')
              expect(res.locals.warnings.sections).to.deep.equal([
                { name: 'buzz', order: 1 },
                { name: 'fizz', order: 2 },
              ])
            })
          })
        })

        context('with assessment answers', function () {
          beforeEach(function () {
            req.move.profile.assessment_answers = [
              { name: 'buzz', order: 3, key: 'risk' },
              { name: 'fizz', order: 7, key: 'health' },
              { name: 'foo', order: 2, key: 'risk' },
              { name: 'bar', order: 1, key: 'court' },
            ]
          })

          context('when move requires youth risk assessment', function () {
            beforeEach(function () {
              req.move.profile.requires_youth_risk_assessment = true
              middleware(req, res, nextSpy)
            })

            it('should set sections variable to empty array', function () {
              expect(res.locals.warnings).to.have.property('sections')
              expect(res.locals.warnings.sections).to.deep.equal([])
            })
          })

          context(
            'when move does not require youth risk assessment',
            function () {
              beforeEach(function () {
                req.move.profile.requires_youth_risk_assessment = false
                middleware(req, res, nextSpy)
              })

              it('should set sections variable to assessment answers', function () {
                expect(res.locals.warnings).to.have.property('sections')
                expect(res.locals.warnings.sections).to.deep.equal([
                  { name: 'buzz', order: 3, key: 'risk' },
                  { name: 'fizz', order: 7, key: 'health' },
                  { name: 'foo', order: 2, key: 'risk' },
                ])
              })
            }
          )
        })

        context('without profile', function () {
          beforeEach(function () {
            delete req.move.profile
            middleware(req, res, nextSpy)
          })

          it('should set sections variable as empty array', function () {
            expect(res.locals.warnings).to.have.property('sections')
            expect(res.locals.warnings.sections).to.deep.equal([])
          })
        })
      })

      describe('tagList', function () {
        context('when Person Escort Record is completed', function () {
          beforeEach(function () {
            req.move.profile.person_escort_record = {
              status: 'completed',
              flags: ['foo', 'bar'],
            }
            middleware(req, res, nextSpy)
          })

          it('should call correct presenter', function () {
            expect(
              presenters.frameworkFlagsToTagList
            ).to.have.been.calledOnceWithExactly({
              flags: req.move.profile.person_escort_record.flags,
              hrefPrefix: '/original-url',
              includeLink: true,
            })
          })

          it('should set tagList variable', function () {
            expect(res.locals.warnings).to.have.property('tagList')
            expect(res.locals.warnings.tagList).to.equal(
              '__frameworkFlagsToTagList__'
            )
          })
        })

        context('when Person Escort Record is not completed', function () {
          beforeEach(function () {
            req.move.profile.person_escort_record = {
              status: 'in_progress',
              flags: ['foo', 'bar'],
            }
            middleware(req, res, nextSpy)
          })

          it('should call correct presenter', function () {
            expect(presenters.frameworkFlagsToTagList).not.to.have.been.called
          })

          it('should set tagList variable as undefined', function () {
            expect(res.locals.warnings).to.have.property('tagList')
            expect(res.locals.warnings.tagList).to.be.undefined
          })
        })

        context('without Person Escort Record', function () {
          beforeEach(function () {
            req.move.profile = {}
            middleware(req, res, nextSpy)
          })

          it('should call correct presenter', function () {
            expect(presenters.frameworkFlagsToTagList).not.to.have.been.called
          })

          it('should set tagList variable as undefined', function () {
            expect(res.locals.warnings).to.have.property('tagList')
            expect(res.locals.warnings.tagList).to.be.undefined
          })
        })

        context('without profile', function () {
          beforeEach(function () {
            req.move.profile = undefined
            middleware(req, res, nextSpy)
          })

          it('should call correct presenter', function () {
            expect(presenters.frameworkFlagsToTagList).not.to.have.been.called
          })

          it('should set tagList variable as undefined', function () {
            expect(res.locals.warnings).to.have.property('tagList')
            expect(res.locals.warnings.tagList).to.be.undefined
          })
        })
      })

      it('should call next', function () {
        middleware(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
