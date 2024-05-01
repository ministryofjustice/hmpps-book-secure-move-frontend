const FormController = require('hmpo-form-wizard').Controller
const proxyquire = require('proxyquire')

const commonMiddleware = require('../../../../../common/middleware')

const BaseController = require('./base')

const FEATURE_FLAGS = {}

const Controller = proxyquire('./move-details', {
  '../../../../../config': { FEATURE_FLAGS },
})

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Move Details', function () {
    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveTypes')
        sinon.stub(commonMiddleware, 'setLocationItems')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(8)
      })

      it('should call setMoveType middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveTypes
        )
      })

      it('should call correct number of middleware', function () {
        expect(commonMiddleware.setLocationItems.callCount).to.equal(7)
      })

      it('should call setLocationItems middleware to set AP locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(0)
        ).to.have.been.calledWith(
          'approved_premises',
          'to_location_approved_premises'
        )
      })

      it('should call setLocationItems middleware to set court locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(1)
        ).to.have.been.calledWith('court', 'to_location_court_appearance')
      })

      it('should call setLocationItems middleware to set prison locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(2)
        ).to.have.been.calledWith('prison', 'to_location_prison_transfer')
      })

      it('should call setLocationItems middleware to set police locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(3)
        ).to.have.been.calledWith('police', 'to_location_police_transfer')
      })

      it('should call setLocationItems middleware to set hospital locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(4)
        ).to.have.been.calledWith(
          ['hospital', 'high_security_hospital'],
          'to_location_hospital'
        )
      })

      it('should call setLocationItems middleware to set SCH locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(5)
        ).to.have.been.calledWith(
          'secure_childrens_home',
          'to_location_secure_childrens_home'
        )
      })

      it('should call setLocationItems middleware to set STC locations', function () {
        expect(
          commonMiddleware.setLocationItems.getCall(6)
        ).to.have.been.calledWith(
          'secure_training_centre',
          'to_location_secure_training_centre'
        )
      })
    })

    describe('#setMoveTypes()', function () {
      let req, res, nextSpy
      const getMoveStub = sinon.stub().returns({})

      beforeEach(function () {
        FEATURE_FLAGS.EXTRADITION_MOVES = true
        req = {
          session: {},
          form: {
            options: {
              fields: {
                move_type: {
                  items: [
                    {
                      value: 'court_appearance',
                      conditional: 'to_location_court_appearance',
                    },
                    {
                      value: 'prison_transfer',
                      conditional: 'to_location_prison_transfer',
                    },
                    {
                      value: 'police_transfer',
                      conditional: 'to_location_police_transfer',
                    },
                    {
                      value: 'hospital',
                      conditional: 'to_location_hospital',
                    },
                    {
                      value: 'prison_recall',
                      conditional: 'additional_information',
                    },
                    {
                      value: 'video_remand',
                      conditional: 'additional_information',
                    },
                    {
                      value: 'approved_premises',
                      conditional: 'to_location_approved_premises',
                    },
                    {
                      value: 'extradition',
                      conditional: 'to_location_extradition',
                    },
                  ],
                },
                to_location_court_appearance: {},
                to_location_police_transfer: {},
                to_location_prison_transfer: {},
                to_location_hospital: {},
                additional_information: {},
                unrelated_field: {},
              },
            },
          },
          getMove: getMoveStub,
        }
        res = {}
        nextSpy = sinon.spy()
      })

      context('with no permissions', function () {
        beforeEach(async function () {
          await controller.setMoveTypes(req, res, nextSpy)
        })

        it('should remove all items from move_type', function () {
          expect(req.form.options.fields.move_type.items.length).to.equal(0)
        })

        it('should remove all conditional fields', function () {
          expect(req.form.options.fields).to.deep.equal({
            move_type: {
              items: [],
            },
            unrelated_field: {},
          })
        })
      })

      context('with permissions for all move types', function () {
        beforeEach(function () {
          req.session.user = {
            permissions: [
              'move:create:approved_premises',
              'move:create:court_appearance',
              'move:create:prison_transfer',
              'move:create:police_transfer',
              'move:create:hospital',
              'move:create:prison_recall',
              'move:create:video_remand',
            ],
          }
        })

        context('when from police location', function () {
          beforeEach(async function () {
            getMoveStub.returns({ from_location_type: 'police' })
            await controller.setMoveTypes(req, res, nextSpy)
          })

          it('should remove just one item from move_type', function () {
            expect(req.form.options.fields.move_type.items.length).to.equal(6)
          })

          it('should remove AP and extradition', function () {
            expect(req.form.options.fields).to.deep.equal({
              move_type: {
                items: [
                  {
                    value: 'court_appearance',
                    conditional: 'to_location_court_appearance',
                  },
                  {
                    value: 'prison_transfer',
                    conditional: 'to_location_prison_transfer',
                  },
                  {
                    value: 'police_transfer',
                    conditional: 'to_location_police_transfer',
                  },
                  {
                    value: 'hospital',
                    conditional: 'to_location_hospital',
                  },
                  {
                    value: 'prison_recall',
                    conditional: 'additional_information',
                  },
                  {
                    value: 'video_remand',
                    conditional: 'additional_information',
                  },
                ],
              },
              to_location_court_appearance: {},
              to_location_prison_transfer: {},
              to_location_police_transfer: {},
              to_location_hospital: {},
              additional_information: {},
              unrelated_field: {},
            })
          })
        })

        context(
          'when from police location and move already exists',
          function () {
            beforeEach(async function () {
              getMoveStub.returns({
                from_location: { location_type: 'police' },
              })
              await controller.setMoveTypes(req, res, nextSpy)
            })

            it('should remove one item from move_type', function () {
              expect(req.form.options.fields.move_type.items.length).to.equal(6)
            })
          }
        )

        context('when from non-police or non-prison location', function () {
          beforeEach(async function () {
            getMoveStub.returns({ from_location_type: 'court' })
            await controller.setMoveTypes(req, res, nextSpy)
          })

          it('should remove two items from move_type', function () {
            expect(req.form.options.fields.move_type.items.length).to.equal(5)
          })

          it('should remove the prison_recall, approved_premises and extradition fields', function () {
            expect(req.form.options.fields).to.deep.equal({
              move_type: {
                items: [
                  {
                    value: 'court_appearance',
                    conditional: 'to_location_court_appearance',
                  },
                  {
                    value: 'prison_transfer',
                    conditional: 'to_location_prison_transfer',
                  },
                  {
                    value: 'police_transfer',
                    conditional: 'to_location_police_transfer',
                  },
                  {
                    value: 'hospital',
                    conditional: 'to_location_hospital',
                  },
                  {
                    value: 'video_remand',
                    conditional: 'additional_information',
                  },
                ],
              },
              to_location_court_appearance: {},
              to_location_prison_transfer: {},
              to_location_police_transfer: {},
              to_location_hospital: {},
              unrelated_field: {},
            })
          })
        })
        context('when from prison location', function () {
          const extraditionEnabledLocationDetail = {
            title: 'mock from location',
            location_type: 'prison',
            extradition_capable: true,
          }
          beforeEach(async function () {
            FEATURE_FLAGS.EXTRADITION_MOVES = true
            getMoveStub.returns({ from_location_type: 'prison' })
            req = {
              ...req,
              services: {
                referenceData: {
                  getLocationById: sinon
                    .stub()
                    .resolves(extraditionEnabledLocationDetail),
                },
              },
            }
            await controller.setMoveTypes(req, res, nextSpy)
          })

          it('should remove one item from move_type', function () {
            expect(req.form.options.fields.move_type.items.length).to.equal(7)
          })

          it('should remove the prison_recall field only', function () {
            expect(req.form.options.fields).to.deep.equal({
              move_type: {
                items: [
                  {
                    value: 'court_appearance',
                    conditional: 'to_location_court_appearance',
                  },
                  {
                    value: 'prison_transfer',
                    conditional: 'to_location_prison_transfer',
                  },
                  {
                    value: 'police_transfer',
                    conditional: 'to_location_police_transfer',
                  },
                  {
                    value: 'hospital',
                    conditional: 'to_location_hospital',
                  },
                  {
                    value: 'video_remand',
                    conditional: 'additional_information',
                  },
                  {
                    value: 'approved_premises',
                    conditional: 'to_location_approved_premises',
                  },
                  {
                    value: 'extradition',
                    conditional: 'to_location_extradition',
                  },
                ],
              },
              to_location_court_appearance: {},
              to_location_prison_transfer: {},
              to_location_police_transfer: {},
              to_location_hospital: {},
              unrelated_field: {},
            })
          })
          context('with extradition moves feature flagged off', function () {
            beforeEach(async function () {
              FEATURE_FLAGS.EXTRADITION_MOVES = false
              await controller.setMoveTypes(req, res, nextSpy)
            })

            it('should remove two items from move_type', function () {
              expect(req.form.options.fields.move_type.items.length).to.equal(6)
            })

            it('should remove recall and extradition', function () {
              expect(req.form.options.fields).to.deep.equal({
                move_type: {
                  items: [
                    {
                      value: 'court_appearance',
                      conditional: 'to_location_court_appearance',
                    },
                    {
                      value: 'prison_transfer',
                      conditional: 'to_location_prison_transfer',
                    },
                    {
                      value: 'police_transfer',
                      conditional: 'to_location_police_transfer',
                    },
                    {
                      value: 'hospital',
                      conditional: 'to_location_hospital',
                    },
                    {
                      value: 'video_remand',
                      conditional: 'additional_information',
                    },
                    {
                      value: 'approved_premises',
                      conditional: 'to_location_approved_premises',
                    },
                  ],
                },
                to_location_court_appearance: {},
                to_location_prison_transfer: {},
                to_location_police_transfer: {},
                to_location_hospital: {},
                unrelated_field: {},
              })
            })
          })
          context('with extradition moves disabled for location', function () {
            const extraditionDisabledLocationDetail = {
              title: 'mock from location',
              location_type: 'prison',
              extradition_capable: false,
            }
            beforeEach(async function () {
              req = {
                ...req,
                services: {
                  referenceData: {
                    getLocationById: sinon
                      .stub()
                      .resolves(extraditionDisabledLocationDetail),
                  },
                },
              }
              await controller.setMoveTypes(req, res, nextSpy)
            })

            it('should remove two item from move_type', function () {
              expect(req.form.options.fields.move_type.items.length).to.equal(6)
            })

            it('should remove recall and extradition', function () {
              expect(req.form.options.fields).to.deep.equal({
                move_type: {
                  items: [
                    {
                      value: 'court_appearance',
                      conditional: 'to_location_court_appearance',
                    },
                    {
                      value: 'prison_transfer',
                      conditional: 'to_location_prison_transfer',
                    },
                    {
                      value: 'police_transfer',
                      conditional: 'to_location_police_transfer',
                    },
                    {
                      value: 'hospital',
                      conditional: 'to_location_hospital',
                    },
                    {
                      value: 'video_remand',
                      conditional: 'additional_information',
                    },
                    {
                      value: 'approved_premises',
                      conditional: 'to_location_approved_premises',
                    },
                  ],
                },
                to_location_court_appearance: {},
                to_location_prison_transfer: {},
                to_location_police_transfer: {},
                to_location_hospital: {},
                unrelated_field: {},
              })
            })
          })
          context('with AP moves disabled for a supplier', function () {
            const mockLocationDetail = {
              title: 'mock from location',
              location_type: 'prison',
              suppliers: [
                {
                  key: 'serco',
                },
              ],
            }

            beforeEach(async function () {
              FEATURE_FLAGS.AP_DISABLED_SUPPLIERS = ['serco']
              req = {
                ...req,
                services: {
                  referenceData: {
                    getLocationById: sinon.stub().resolves(mockLocationDetail),
                  },
                },
              }
              await controller.setMoveTypes(req, res, nextSpy)
            })

            it('should remove two items from move_type', function () {
              expect(req.form.options.fields.move_type.items.length).to.equal(5)
            })

            it('should remove AP in addition to recall', function () {
              expect(req.form.options.fields).to.deep.equal({
                move_type: {
                  items: [
                    {
                      value: 'court_appearance',
                      conditional: 'to_location_court_appearance',
                    },
                    {
                      value: 'prison_transfer',
                      conditional: 'to_location_prison_transfer',
                    },
                    {
                      value: 'police_transfer',
                      conditional: 'to_location_police_transfer',
                    },
                    {
                      value: 'hospital',
                      conditional: 'to_location_hospital',
                    },
                    {
                      value: 'video_remand',
                      conditional: 'additional_information',
                    },
                  ],
                },
                to_location_court_appearance: {},
                to_location_prison_transfer: {},
                to_location_police_transfer: {},
                to_location_hospital: {},
                unrelated_field: {},
              })
            })
          })
        })
      })

      context('with permissions for only some move types', function () {
        beforeEach(async function () {
          req.session.user = {
            permissions: ['move:create:court_appearance'],
          }
          await controller.setMoveTypes(req, res, nextSpy)
        })

        it('should remove unpermitted items from move_type', function () {
          expect(req.form.options.fields.move_type.items.length).to.equal(1)
        })

        it('should remove unpermitted conditional fields', function () {
          expect(req.form.options.fields).to.deep.equal({
            move_type: {
              items: [
                {
                  value: 'court_appearance',
                  conditional: 'to_location_court_appearance',
                },
              ],
            },
            to_location_court_appearance: {},
            unrelated_field: {},
          })
        })
      })
    })

    describe('#process()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
          sessionModel: {
            get: sinon.stub(),
          },
        }
      })
      context('when location type is court', function () {
        beforeEach(function () {
          req.form.values = {
            move_type: 'court_appearance',
            to_location: '',
            to_location_court_appearance: '12345',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('12345')
        })

        it('should not set additional_information', function () {
          expect(req.form.values.additional_information).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is prison recall', function () {
        const mockComments = 'Some prison recall specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_recall',
            prison_recall_comments: mockComments,
            to_location: '',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should not set to_location', function () {
          expect(req.form.values.to_location).to.be.undefined
        })

        it('should set additional_information', function () {
          expect(req.form.values.additional_information).to.equal(mockComments)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is video remand', function () {
        const mockComments = 'Some prison recall specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'video_remand',
            video_remand_comments: mockComments,
            to_location: '',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should not set to_location', function () {
          expect(req.form.values.to_location).to.be.undefined
        })

        it('should set additional_information', function () {
          expect(req.form.values.additional_information).to.equal(mockComments)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is police transfer', function () {
        beforeEach(function () {
          req.form.values = {
            move_type: 'police_transfer',
            to_location: '',
            to_location_police_transfer: '67890',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('67890')
        })

        it('should not set additional_information', function () {
          expect(req.form.values.additional_information).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is hospital', function () {
        beforeEach(function () {
          req.form.values = {
            move_type: 'hospital',
            to_location: '',
            to_location_hospital: '67890',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('67890')
        })

        it('should not set additional_information', function () {
          expect(req.form.values.additional_information).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is prison transfer', function () {
        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_transfer',
            to_location: '',
            to_location_prison_transfer: '67890',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('67890')
        })

        it('should not set additional_information', function () {
          expect(req.form.values.additional_information).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is not a prison recall', function () {
        const mockComments = 'Some prison recall specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_transfer',
            additional_information: mockComments,
            to_location: '',
          }
        })

        context('when existing move type is prison recall', function () {
          beforeEach(function () {
            req.sessionModel.get.returns('prison_recall')
            controller.process(req, {}, nextSpy)
          })

          it('should clear additional_information', function () {
            expect(req.form.values.additional_information).to.equal(null)
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when existing move type is not prison recall', function () {
          beforeEach(function () {
            controller.process(req, {}, nextSpy)
          })

          it('should not clear additional_information', function () {
            expect(req.form.values.additional_information).to.equal(
              mockComments
            )
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when location type is not a video remand', function () {
        const mockComments = 'Some video remand specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_transfer',
            additional_information: mockComments,
            to_location: '',
          }
        })

        context('when existing move type is video remand', function () {
          beforeEach(function () {
            req.sessionModel.get.returns('video_remand')
            controller.process(req, {}, nextSpy)
          })

          it('should clear additional_information', function () {
            expect(req.form.values.additional_information).to.equal(null)
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when existing move type is not video remand', function () {
          beforeEach(function () {
            controller.process(req, {}, nextSpy)
          })

          it('should not clear additional_information', function () {
            expect(req.form.values.additional_information).to.equal(
              mockComments
            )
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#successHandler()', function () {
      const toLocationId = '123456-7'
      const mockLocationDetail = {
        title: 'mock to location',
        location_type: 'prison',
      }
      let req, res, nextSpy, referenceDataService

      beforeEach(function () {
        referenceDataService = {
          getLocationById: sinon.stub().resolves(mockLocationDetail),
        }
        nextSpy = sinon.spy()
        req = {
          sessionModel: {
            toJSON: sinon.stub(),
            set: sinon.spy(),
          },
          services: {
            referenceData: referenceDataService,
          },
        }
        res = {
          locals: {},
        }

        sinon.spy(FormController.prototype, 'successHandler')
      })

      context('with location_id', function () {
        beforeEach(async function () {
          req.sessionModel.toJSON.returns({ to_location: toLocationId })

          await controller.successHandler(req, res, nextSpy)
        })

        it('should set to_location in session as expected', function () {
          expect(req.sessionModel.set).to.have.been.calledTwice
          expect(req.sessionModel.set.firstCall.args).to.deep.equal([
            'to_location',
            mockLocationDetail,
          ])
          expect(req.sessionModel.set.secondCall.args).to.deep.equal([
            'to_location_type',
            mockLocationDetail.location_type,
          ])
        })

        it('should call parent successHandler', function () {
          expect(FormController.prototype.successHandler).to.be.calledOnceWith(
            req,
            res,
            nextSpy
          )
        })
      })

      context('without location_id', function () {
        beforeEach(async function () {
          req.sessionModel.toJSON.returns({ to_location: '' })

          await controller.successHandler(req, res, nextSpy)
        })

        it('should not set to_location in session', function () {
          expect(req.sessionModel.set).not.to.be.called
        })

        it('should call parent successHandler', function () {
          expect(FormController.prototype.successHandler).to.be.calledOnceWith(
            req,
            res,
            nextSpy
          )
        })
      })

      context('when getLocationById throws and error', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          req.sessionModel.toJSON.returns({ to_location: toLocationId })
          req.services.referenceData.getLocationById = sinon
            .stub()
            .throws(errorMock)

          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })

        it('should not call parent successHandler', function () {
          expect(FormController.prototype.successHandler).not.to.be.called
        })
      })
    })
  })
})
