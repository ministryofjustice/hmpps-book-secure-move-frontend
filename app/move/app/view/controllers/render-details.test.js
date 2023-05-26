const proxyquire = require('proxyquire')

const moveHelpers = require('../../../../../common/helpers/move')
const presenters = require('../../../../../common/presenters')

const controller = proxyquire('./render-details', {
  '../../../../../common/helpers/move': moveHelpers,
})

describe('Move view app', function () {
  describe('Controllers', function () {
    describe('#renderDetails()', function () {
      let req, res
      const mockUpdateUrls = {
        move: '/move-url',
        date: '/date-url',
      }
      const mockAssessmentAnswersByCategory = [
        {
          key: 'court',
        },
        {
          key: 'risk',
        },
        {
          key: 'health',
        },
        {
          key: 'other',
        },
        undefined,
        null,
      ]

      beforeEach(function () {
        sinon.stub(moveHelpers, 'canEditMoveDate').returns(true)
        sinon.stub(moveHelpers, 'canEditMoveDestination').returns(true)
        sinon.stub(moveHelpers, 'canEditMove').returns(true)
        sinon.stub(moveHelpers, 'getUpdateUrls').returns(mockUpdateUrls)
        sinon.stub(moveHelpers, 'mapUpdateLink').returnsArg(0)
        sinon
          .stub(presenters, 'moveToSummaryListComponent')
          .returns('_moveToSummaryListComponent_')
        sinon
          .stub(presenters, 'moveToAdditionalInfoListComponent')
          .returns('_moveToAdditionalInfoListComponent_')
        sinon
          .stub(presenters, 'singleRequestToSummaryListComponent')
          .returns('_singleRequestToSummaryListComponent_')
        sinon
          .stub(presenters, 'assessmentAnswersByCategory')
          .returns(mockAssessmentAnswersByCategory)
        sinon
          .stub(presenters, 'assessmentCategoryToSummaryListComponent')
          .returnsArg(0)

        req = {
          canAccess: sinon.stub().returns(true),
          move: {
            id: '12345',
            move_type: 'prison_transfer',
            _canEdit: true,
          },
          journeys: [],
          t: sinon.stub().returnsArg(0),
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }
      })

      describe('locals', function () {
        beforeEach(function () {})

        describe('allocation', function () {
          beforeEach(function () {
            req.move.allocation = {
              id: '_allocation_',
            }

            controller(req, res)
          })

          it('should set allocation property', function () {
            const locals = res.render.args[0][1]
            expect(locals.allocation).to.deep.equal({
              id: '_allocation_',
            })
          })
        })

        describe('canEditPer', function () {
          beforeEach(function () {
            req.move._canEditPer = true

            controller(req, res)
          })

          it('should set canEditPer property', function () {
            const locals = res.render.args[0][1]
            expect(locals.canEditPer).to.equal(true)
          })
        })

        describe('isAllocationMove', function () {
          context('with allocation', function () {
            beforeEach(function () {
              req.move.allocation = {
                id: '_allocation_',
              }

              controller(req, res)
            })

            it('should set isAllocationMove property', function () {
              const locals = res.render.args[0][1]
              expect(locals.isAllocationMove).to.be.true
            })
          })

          context('without allocation', function () {
            beforeEach(function () {
              req.move.allocation = null

              controller(req, res)
            })

            it('should set isAllocationMove property', function () {
              const locals = res.render.args[0][1]
              expect(locals.isAllocationMove).to.be.false
            })
          })
        })

        describe('moveSummary', function () {
          beforeEach(function () {
            controller(req, res)
          })

          it('should call moveToSummaryListComponent', function () {
            expect(
              presenters.moveToSummaryListComponent
            ).to.be.calledOnceWithExactly(req.move, req.journeys, {
              updateUrls: mockUpdateUrls,
              canAccess: req.canAccess,
            })
          })

          it('should call getUpdateUrls', function () {
            const locals = res.render.args[0][1]
            expect(locals.moveSummary).to.deep.equal(
              '_moveToSummaryListComponent_'
            )
          })
        })

        describe('sections', function () {
          context('without profile', function () {
            beforeEach(function () {
              controller(req, res)
            })

            it('should not include any sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections).to.deep.equal({
                editable: undefined,
                uneditable: undefined,
              })
            })
          })

          context('without Person Escort Record', function () {
            beforeEach(function () {
              req.move.profile = {
                id: '_profile_id_',
                person_escort_record: null,
              }
              controller(req, res)
            })

            it('sections should contain correct keys', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections).to.have.all.keys([
                'editable',
                'uneditable',
              ])
            })

            it('should include correct editable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).to.deep.equal([
                '_singleRequestToSummaryListComponent_',
                '_moveToAdditionalInfoListComponent_',
                { key: 'other' },
                { key: 'risk' },
                { key: 'health' },
              ])
            })

            it('should exlude court information from non-court moves', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).not.to.deep.include({
                key: 'court',
              })
            })

            it('should not include any uneditable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.uneditable).to.be.undefined
            })
          })

          context('with completed Person Escort Record', function () {
            beforeEach(function () {
              req.move.profile = {
                id: '_profile_id_',
                person_escort_record: {
                  id: '_per_id_',
                  status: 'completed',
                },
              }
              controller(req, res)
            })

            it('sections should contain correct keys', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections).to.have.all.keys([
                'editable',
                'uneditable',
              ])
            })

            it('should exclude risk and health from editable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).to.deep.equal([
                '_singleRequestToSummaryListComponent_',
                '_moveToAdditionalInfoListComponent_',
                { key: 'other' },
              ])
            })

            it('should exlude court information from non-court moves', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).not.to.deep.include({
                key: 'court',
              })
            })

            it('should include risk and health in uneditable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.uneditable).to.deep.equal([
                { key: 'risk' },
                { key: 'health' },
              ])
            })
          })

          context('with unstarted Person Escort Record', function () {
            beforeEach(function () {
              req.move.profile = {
                id: '_profile_id_',
                person_escort_record: {
                  id: '_per_id_',
                  status: 'not_started',
                },
              }
              controller(req, res)
            })

            it('sections should contain correct keys', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections).to.have.all.keys([
                'editable',
                'uneditable',
              ])
            })

            it('should include correct editable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).to.deep.equal([
                '_singleRequestToSummaryListComponent_',
                '_moveToAdditionalInfoListComponent_',
                { key: 'other' },
                { key: 'risk' },
                { key: 'health' },
              ])
            })

            it('should exlude court information from non-court moves', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).not.to.deep.include({
                key: 'court',
              })
            })

            it('should not include any uneditable sections', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.uneditable).to.be.undefined
            })
          })

          context('with court move', function () {
            beforeEach(function () {
              req.move.move_type = 'court_appearance'
              req.move.profile = {
                id: '_profile_id_',
                person_escort_record: null,
              }
              controller(req, res)
            })

            it('should exlude court information from non-court moves', function () {
              const locals = res.render.args[0][1]
              expect(locals.sections.editable).to.deep.include({ key: 'court' })
            })
          })
        })

        describe('updateLinks', function () {
          beforeEach(function () {
            controller(req, res)
          })

          it('should call getUpdateUrls', function () {
            expect(moveHelpers.getUpdateUrls).to.be.calledOnceWithExactly(
              req.move,
              req.canAccess
            )
          })

          it('should map update URLs', function () {
            expect(moveHelpers.mapUpdateLink.callCount).to.equal(
              Object.keys(mockUpdateUrls).length
            )
          })

          it('should call getUpdateUrls', function () {
            const locals = res.render.args[0][1]
            expect(locals.updateLinks).to.deep.equal({
              move: '/move-url',
            })
          })
        })
      })

      it('should render a template', function () {
        controller(req, res)
        expect(res.render.args[0][0]).to.equal('move/app/view/views/details')
      })
    })
  })
})
