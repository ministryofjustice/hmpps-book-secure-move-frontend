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
          .stub(presenters, 'moveToImportantEventsTagListComponent')
          .returns('__moveToImportantEventsTagListComponent__')
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
            expect(presenters.frameworkSectionToPanelList).to.be.calledOnce
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
            req.move.profile.person_escort_record = null
            middleware(req, res, nextSpy)
          })

          it('should set sections variable to a sensible default', function () {
            expect(res.locals.warnings).to.have.property('sections')
            expect(res.locals.warnings.sections).to.deep.equal([
              {
                name: 'Risk information',
                order: 1,
              },
              {
                name: 'Offence information',
                order: 2,
              },
              {
                name: 'Health information',
                order: 3,
              },
              {
                name: 'Property information',
                order: 4,
              },
            ])
          })
        })

        context('with important events', function () {
          beforeEach(async function () {
            req.move.important_events = [{ id: 10 }]
            await middleware(req, res, nextSpy)
          })

          it('should set sections variable to include important events', function () {
            expect(res.locals.warnings).to.have.property('sections')
            expect(res.locals.warnings.sections).to.deep.equal([
              {
                context: 'framework',
                count: 0,
                isCompleted: true,
                key: 'in-transit-events',
                name: 'In transit information',
                panels: [],
              },
              {
                name: 'Risk information',
                order: 1,
              },
              {
                name: 'Offence information',
                order: 2,
              },
              {
                name: 'Health information',
                order: 3,
              },
              {
                name: 'Property information',
                order: 4,
              },
            ])
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
      })

      describe('importantEventsTagList', function () {
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
              presenters.moveToImportantEventsTagListComponent
            ).to.have.been.calledOnceWithExactly(req.move, true)
          })

          it('should set importantEventsTagList variable', function () {
            expect(res.locals.warnings).to.have.property(
              'importantEventsTagList'
            )
            expect(res.locals.warnings.importantEventsTagList).to.equal(
              '__moveToImportantEventsTagListComponent__'
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
            expect(presenters.moveToImportantEventsTagListComponent).not.to.have
              .been.called
          })

          it('should set tagList variable as undefined', function () {
            expect(res.locals.warnings).to.have.property(
              'importantEventsTagList'
            )
            expect(res.locals.warnings.importantEventsTagList).to.be.undefined
          })
        })

        context('without Person Escort Record', function () {
          beforeEach(function () {
            req.move.profile = {}
            middleware(req, res, nextSpy)
          })

          it('should call correct presenter', function () {
            expect(presenters.moveToImportantEventsTagListComponent).not.to.have
              .been.called
          })

          it('should set tagList variable as undefined', function () {
            expect(res.locals.warnings).to.have.property(
              'importantEventsTagList'
            )
            expect(res.locals.warnings.importantEventsTagList).to.be.undefined
          })
        })
      })

      context('with undefined profile', function () {
        beforeEach(function () {
          delete req.move.profile
          middleware(req, res, nextSpy)
        })

        it('should not set warnings', function () {
          expect(res.locals).not.to.have.property('warnings')
        })

        it('should not set warnings', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with null profile', function () {
        beforeEach(function () {
          req.move.profile = null
          middleware(req, res, nextSpy)
        })

        it('should not set warnings', function () {
          expect(res.locals).not.to.have.property('warnings')
        })

        it('should not set warnings', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      it('should call next', function () {
        middleware(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
