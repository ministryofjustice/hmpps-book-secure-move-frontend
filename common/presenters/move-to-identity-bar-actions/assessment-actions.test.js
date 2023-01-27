const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

const presenter = require('./assessment-actions')

describe('Presenters', function () {
  describe('Move identity bar actions', function () {
    describe('#assessmentActions', function () {
      let output, mockMove, canAccessStub, featureFlagStub

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(componentService, 'getComponent').callsFake((name, args) => {
          const obj = {}

          obj[name] = args

          return obj
        })
        canAccessStub = sinon.stub().returns(true)
        featureFlagStub = { ADD_LODGE_BUTTON: false }

        mockMove = {
          id: '12345',
          status: 'requested',
        }
      })

      context('without args', function () {
        it('should return empty object', function () {
          output = presenter()
          expect(output).to.deep.equal([])
        })
      })

      describe('Youth Risk Assessment', function () {
        beforeEach(function () {
          mockMove.profile = {
            requires_youth_risk_assessment: true,
          }
        })

        context('with unstarted assessment', function () {
          beforeEach(function () {
            mockMove.profile.youth_risk_assessment = null
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                { featureFlags: featureFlagStub }
              )
            })

            it('should return start action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/youth-risk-assessment/new?returnUrl=%2Fmove%2F${mockMove.id}%2Fyouth-risk-assessment`,
                      preventDoubleClick: true,
                      text: 'actions::start_assessment',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })

          context('without assessment create access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('youth_risk_assessment:create')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })

        context('with in progress assessment', function () {
          beforeEach(function () {
            mockMove.profile.youth_risk_assessment = {
              status: 'incomplete',
            }
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return continue action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/youth-risk-assessment`,
                      preventDoubleClick: true,
                      text: 'actions::continue_assessment',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })

          context('without assessment create access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('youth_risk_assessment:create')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })

        context('with completed assessment', function () {
          beforeEach(function () {
            mockMove.profile.youth_risk_assessment = {
              status: 'completed',
            }
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return confirm action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/youth-risk-assessment/confirm`,
                      preventDoubleClick: true,
                      text: 'actions::provide_confirmation',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return confirm action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/youth-risk-assessment/confirm`,
                      preventDoubleClick: true,
                      text: 'actions::provide_confirmation',
                    },
                  },
                },
              ])
            })
          })

          context('without assessment confirm access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('youth_risk_assessment:confirm')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })

        context('with confirmed assessment', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = null
            mockMove.profile.youth_risk_assessment = {
              status: 'confirmed',
            }
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return PER start action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record/new?returnUrl=%2Fmove%2F${mockMove.id}%2Fperson-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::start_assessment',
                    },
                  },
                },
              ])
            })
          })

          context('without PER create access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('person_escort_record:create')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })
      })

      describe('Person Escort Record', function () {
        beforeEach(function () {
          mockMove.profile = {}
        })

        context('with unstarted assessment', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = null
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return start action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record/new?returnUrl=%2Fmove%2F${mockMove.id}%2Fperson-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::start_assessment',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })

          context('without assessment create access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('person_escort_record:create')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })

        context('with in progress assessment', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = {
              status: 'incomplete',
            }
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return continue action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::continue_assessment',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })

          context('without assessment create access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('person_escort_record:create')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should not return any actions', function () {
              expect(output).to.deep.equal([])
            })
          })
        })

        context('with completed assessment', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = {
              status: 'completed',
            }
          })

          describe('default', function () {
            beforeEach(function () {
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return confirm and view action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record/confirm`,
                      preventDoubleClick: true,
                      text: 'actions::provide_confirmation',
                    },
                  },
                },
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::view_assessment',
                      classes: 'govuk-button--secondary',
                    },
                  },
                },
              ])
            })
          })

          context('with completed move', function () {
            beforeEach(function () {
              mockMove.status = 'completed'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return confirm and view action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record/confirm`,
                      preventDoubleClick: true,
                      text: 'actions::provide_confirmation',
                    },
                  },
                },
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::view_assessment',
                      classes: 'govuk-button--secondary',
                    },
                  },
                },
              ])
            })
          })

          context('with cancelled move', function () {
            beforeEach(function () {
              mockMove.status = 'cancelled'
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return view action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::view_assessment',
                      classes: 'govuk-button--secondary',
                    },
                  },
                },
              ])
            })
          })

          context('without assessment confirm access', function () {
            beforeEach(function () {
              canAccessStub
                .withArgs('person_escort_record:confirm')
                .returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return view action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record`,
                      preventDoubleClick: true,
                      text: 'actions::view_assessment',
                      classes: 'govuk-button--secondary',
                    },
                  },
                },
              ])
            })
          })

          context('without assessment view access', function () {
            beforeEach(function () {
              canAccessStub.withArgs('person_escort_record:view').returns(false)
              output = presenter(
                mockMove,
                { canAccess: canAccessStub },
                featureFlagStub
              )
            })

            it('should return confirm action', function () {
              expect(output).to.deep.equal([
                {
                  html: {
                    govukButton: {
                      href: `/move/${mockMove.id}/person-escort-record/confirm`,
                      preventDoubleClick: true,
                      text: 'actions::provide_confirmation',
                    },
                  },
                },
              ])
            })
          })
        })

        context('with confirmed assessment', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = {
              status: 'confirmed',
              handover_occurred_at: '2020-01-01',
            }
            output = presenter(
              mockMove,
              { canAccess: canAccessStub },
              featureFlagStub
            )
          })

          it('should return view action', function () {
            expect(output).to.deep.equal([
              {
                html: {
                  govukButton: {
                    href: `/move/${mockMove.id}/person-escort-record`,
                    preventDoubleClick: true,
                    text: 'actions::view_assessment',
                    classes: 'govuk-button--secondary',
                  },
                },
              },
            ])
          })
        })
        context('with feature flag enabled', function () {
          beforeEach(function () {
            mockMove.profile.person_escort_record = {
              status: 'confirmed',
              handover_occurred_at: '2020-01-01',
            }
            const featureFlagOnStub = { ADD_LODGE_BUTTON: true }
            mockMove.status = 'in_transit'
            output = presenter(
              mockMove,
              { canAccess: canAccessStub },
              featureFlagOnStub
            )
          })

          it('should show add lodge button', function () {
            expect(output).to.deep.equal([
              {
                html: {
                  govukButton: {
                    classes: 'govuk-button--primary',
                    preventDoubleClick: true,
                    text: 'actions::add_item',
                  },
                },
              },
              {
                html: {
                  govukButton: {
                    href: `/move/${mockMove.id}/person-escort-record`,
                    preventDoubleClick: true,
                    text: 'actions::view_assessment',
                    classes: 'govuk-button--secondary',
                  },
                },
              },
            ])
          })
        })
      })
    })
  })
})
