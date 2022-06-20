const FormController = require('hmpo-form-wizard').Controller
const { cloneDeep } = require('lodash')

const personService = {
  unformat: sinon.stub(),
}
const filters = require('../../../../../config/nunjucks/filters')
const CreateBaseController = require('../../new/controllers/base')

const BaseProto = CreateBaseController.prototype

const UpdateBaseController = require('./base')

const controller = new UpdateBaseController({ route: '/' })

describe('Move controllers', function () {
  describe('Update base controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(BaseProto, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'canEdit')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(BaseProto.middlewareChecks).to.have.been.calledOnce
      })

      it('should call canEdit middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.canEdit
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#canEdit()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('when move has left custody', function () {
        beforeEach(function () {
          mockReq.move._hasLeftCustody = true
          controller.canEdit(mockReq, mockRes, nextSpy)
        })

        it('should redirect to move', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('when move has not left custody', function () {
        beforeEach(function () {
          mockReq.move._hasLeftCustody = false
          controller.canEdit(mockReq, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#middlewareLocals()', function () {
      it('should not inherit middlewareLocals from CreateBaseController', function () {
        expect(controller.middlewareLocals).to.exist.and.not.equal(
          BaseProto.middlewareLocals
        )
      })
    })

    describe('#setButtonText()', function () {
      it('should inherit setButtonText from CreateBaseController', function () {
        expect(controller.setButtonText).to.exist.and.equal(
          BaseProto.setButtonText
        )
      })
    })

    describe('#setJourneyTimer()', function () {
      it('should inherit setJourneyTimer from CreateBaseController', function () {
        expect(controller.setJourneyTimer).to.exist.and.equal(
          BaseProto.setJourneyTimer
        )
      })
    })

    describe('#checkCurrentLocation()', function () {
      it('should inherit checkCurrentLocation from CreateBaseController', function () {
        expect(controller.checkCurrentLocation).to.exist.and.equal(
          BaseProto.checkCurrentLocation
        )
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(BaseProto, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(BaseProto.middlewareLocals).to.have.been.calledOnce
      })

      it('should call set next step method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setNextStep
        )
      })

      it('should call correct number of additional middleware', function () {
        expect(controller.use).to.be.callCount(2)
      })
    })

    describe('#setCancelUrl()', function () {
      let req = {}
      let res, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          getMoveId: sinon.stub().returns('moveId'),
          move: {
            id: '12345',
            profile: { person: { id: '12345' } },
          },
        }
        res = {
          locals: {
            moveId: '#moveId',
          },
        }

        controller.setCancelUrl(req, res, nextSpy)
      })

      it('should set cancel url correctly', function () {
        expect(res.locals.cancelUrl).to.equal(
          '/person/12345/personal-details?move=moveId'
        )
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setNextStep()', function () {
      let req = {}
      let nextSpy
      const res = {}

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          getMoveId: sinon.stub().returns('moveId'),
          move: {
            id: '12345',
            profile: { person: { id: '12345' } },
          },
          form: {
            options: {},
          },
        }
        controller.getBaseUrl = sinon.stub().returns('/move/moveId')
        controller.setNextStep(req, res, nextSpy)
      })

      it('should set cancel url correctly', function () {
        expect(req.form.options.next).to.equal(
          '/person/12345/personal-details?move=moveId'
        )
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#getUpdateValues()', function () {
      const req = {
        form: {
          options: {
            fields: {
              field1: {},
              field2: {},
            },
          },
        },
        services: {
          person: personService,
        },
      }
      const person = { id: '#personId' }
      const values = { foo: 'bar' }

      beforeEach(function () {
        req.getPerson = sinon.stub().returns(person)
        personService.unformat.resetHistory().returns(values)
      })

      it('should return updated values', function () {
        expect(controller.getUpdateValues(req)).to.equal(values)
      })

      context('When a valid ', function () {
        beforeEach(function () {
          controller.getUpdateValues(req)
        })

        it('should get person data', function () {
          expect(req.getPerson).to.be.calledOnceWithExactly()
        })

        it('should get person data', function () {
          expect(personService.unformat).to.be.calledOnceWithExactly(person, [
            'field1',
            'field2',
          ])
        })
      })
    })

    describe('#setInitialStep()', function () {
      let req
      let nextSpy
      const res = {}

      beforeEach(function () {
        req = {
          get: sinon.stub(),
        }
        controller.getBaseUrl = sinon.stub().returns('/baseUrl')
        nextSpy = sinon.stub()
      })

      it('should invoke the next middleware', function () {
        controller.setInitialStep(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      context('when there is no referrer', function () {
        it('should set initialStep to true', function () {
          controller.setInitialStep(req, res, nextSpy)
          expect(req.initialStep).to.be.true
        })
      })

      context('when referrer is the base page', function () {
        beforeEach(function () {
          req.get.withArgs('referrer').returns('http://example.com/baseUrl')
          controller.setInitialStep(req, res, nextSpy)
        })

        it('should set initialStep to true', function () {
          expect(req.initialStep).to.be.true
        })
      })

      context('when the referrer is anything else', function () {
        beforeEach(function () {
          req.get.withArgs('referrer').returns('http://example.com/someUrl')
          controller.setInitialStep(req, res, nextSpy)
        })

        it('should not set initialStep to true', function () {
          expect(req.initialStep).to.not.be.true
        })
      })
    })

    describe('#_setModels()', function () {
      let req
      const mockSession = {
        id: '#move',
        profile: {
          person: {
            id: '#person',
          },
        },
      }

      beforeEach(function () {
        req = {
          models: {},
          move: mockSession,
        }
        controller._setModels(req)
      })

      it('should add move model to req', function () {
        expect(req.models.move).to.deep.equal(mockSession)
      })

      it('should add profile model to req', function () {
        expect(req.models.profile).to.deep.equal(mockSession.profile)
      })

      it('should add person model to req', function () {
        expect(req.models.person).to.deep.equal(mockSession.profile.person)
      })
    })

    describe('#errorHandler()', function () {
      let reqMock, resMock, errorMock, nextSpy

      beforeEach(function () {
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        sinon.stub(BaseProto, 'errorHandler')
        nextSpy = sinon.spy()
        errorMock = new Error()
        reqMock = {
          form: {
            values: {
              date: '2021-01-20',
            },
          },
          t: sinon.stub().returnsArg(0),
          getMove: sinon.stub().returns({
            id: '12345',
            to_location: {
              title: 'BRIXTON',
            },
            profile: {
              person: {
                _fullname: 'DOE, JOHN',
              },
            },
          }),
        }
        resMock = {
          render: sinon.spy(),
        }
      })

      context('with non validation error', function () {
        beforeEach(function () {
          errorMock.statusCode = 500
          controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
        })

        it('should call parent error handler', function () {
          expect(BaseProto.errorHandler).to.have.been.calledOnceWithExactly(
            errorMock,
            reqMock,
            resMock,
            nextSpy
          )
        })

        it('should not render a template', function () {
          expect(resMock.render).not.to.have.been.called
        })
      })

      context('with validation error', function () {
        const mockExistingMoveId = '_12345_'

        beforeEach(function () {
          errorMock.statusCode = 422
        })

        context('with `taken` error code', function () {
          beforeEach(function () {
            errorMock.errors = [
              {
                code: 'taken',
                meta: {
                  existing_id: mockExistingMoveId,
                },
              },
            ]
            controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
          })

          it('should not call parent error handler', function () {
            expect(BaseProto.errorHandler).not.to.have.been.called
          })

          it('should render a template', function () {
            expect(resMock.render).to.have.been.calledOnceWithExactly(
              'action-prevented',
              {
                backLink: '/move/12345',
                pageTitle: 'validation::move_conflict.heading',
                message: 'validation::move_conflict.message',
                instruction: 'validation::move_conflict.instructions',
              }
            )
          })

          it('should translate page title', function () {
            expect(reqMock.t).to.have.been.calledWithExactly(
              'validation::move_conflict.heading',
              {
                context: 'update',
              }
            )
          })

          it('should translate message', function () {
            expect(reqMock.t).to.have.been.calledWithExactly(
              'validation::move_conflict.message',
              {
                context: 'update',
                href: '/move/_12345_',
                name: 'DOE, JOHN',
                date: '2021-01-20',
              }
            )
          })

          it('should translate instruction', function () {
            expect(reqMock.t).to.have.been.calledWithExactly(
              'validation::move_conflict.instructions',
              {
                date_href: '/move/12345/edit/move-date',
                location_href: '/move/12345/edit/move-details',
              }
            )
          })
        })

        context('with any other error code', function () {
          beforeEach(function () {
            controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
          })

          it('should call parent error handler', function () {
            expect(BaseProto.errorHandler).to.have.been.calledOnceWithExactly(
              errorMock,
              reqMock,
              resMock,
              nextSpy
            )
          })

          it('should not render a template', function () {
            expect(resMock.render).not.to.have.been.called
          })
        })
      })
    })

    describe('#mixin', function () {
      class BaseSource {
        baseMethod() {
          return 'BaseSource'
        }
      }
      class BaseTarget extends BaseSource {
        baseMethod() {
          return 'BaseTarget'
        }
      }
      class ControllerSource extends BaseSource {
        superMethod() {
          return 'ControllerSource - superMethod'
        }

        thisMethod() {
          return 'ControllerSource - thisMethod'
        }

        superMethodSource() {
          return super.baseMethod()
        }

        thisMethodSource() {
          return this.baseMethod()
        }
      }
      class ControllerTarget extends BaseTarget {
        superMethod() {
          return super.baseMethod()
        }

        thisMethod() {
          return this.baseMethod()
        }

        superMethodTarget() {
          return super.baseMethod()
        }

        thisMethodTarget() {
          return this.baseMethod()
        }
      }
      UpdateBaseController.mixin(ControllerTarget, ControllerSource)

      const SourceProto = ControllerSource.prototype
      const TargetProto = ControllerTarget.prototype
      const controller = new ControllerTarget()

      context('When method exists only in target controller', function () {
        it('should leave it untouched', function () {
          expect(TargetProto.superMethodTarget).to.exist
          expect(TargetProto.thisMethodTarget).to.exist
          expect(SourceProto.superMethodTarget).to.not.exist
          expect(SourceProto.thisMethodTarget).to.not.exist
        })

        it('should resolve `this` to extended class', function () {
          expect(controller.thisMethodTarget()).to.equal('BaseTarget')
        })

        it('should resolve `super` to extended class', function () {
          expect(controller.superMethodTarget()).to.equal('BaseTarget')
        })
      })

      context('When method exists in both controllers', function () {
        it('should leave it untouched', function () {
          expect(TargetProto.superMethod).to.exist
          expect(SourceProto.superMethod).to.exist
          expect(TargetProto.superMethod).to.not.equal(SourceProto.superMethod)
          expect(TargetProto.thisMethod).to.exist
          expect(SourceProto.thisMethod).to.exist
          expect(TargetProto.thisMethod).to.not.equal(SourceProto.thisMethod)
        })

        it('should resolve `this` to extended class', function () {
          expect(controller.thisMethod()).to.equal('BaseTarget')
        })

        it('should resolve `super` to extended class', function () {
          expect(controller.superMethod()).to.equal('BaseTarget')
        })
      })

      context('When method exists only in source controller', function () {
        it('should append it to target', function () {
          expect(TargetProto.superMethodSource).to.exist
          expect(TargetProto.superMethodSource).to.equal(
            SourceProto.superMethodSource
          )
          expect(TargetProto.thisMethodSource).to.exist
          expect(TargetProto.thisMethodSource).to.equal(
            SourceProto.thisMethodSource
          )
        })

        it('should resolve `this` to extended class', function () {
          expect(controller.thisMethodSource()).to.equal('BaseTarget')
        })

        it('should resolve `super` to mixed-in class', function () {
          expect(controller.superMethodSource()).to.equal('BaseSource')
        })
      })
    })
  })

  describe('#getErrors()', function () {
    let getErrorsStub
    let req
    let res

    beforeEach(function () {
      getErrorsStub = sinon.stub(BaseProto, 'getErrors')
      req = {}
      res = {}
    })

    context('when req.initialStep is false', function () {
      it('should call the parent getErrors method', function () {
        controller.getErrors(req, res)
        expect(getErrorsStub).to.be.calledOnceWithExactly(req, res)
      })
    })

    context('when req.initialStep is true', function () {
      beforeEach(function () {
        req.initialStep = true
      })

      it('should not call the parent getErrors method', function () {
        controller.getErrors(req, res)
        expect(getErrorsStub).to.not.be.called
      })

      it('should return an empty object', function () {
        expect(controller.getErrors(req, res)).to.deep.equal({})
      })
    })
  })

  describe('#getValues()', function () {
    let getValuesStub
    let callback
    let req
    let res

    beforeEach(function () {
      callback = sinon.spy()
      sinon.stub(controller, 'getUpdateValues').returns({ baz: 'tastic' })
      sinon.stub(controller, 'protectReadOnlyFields')
      getValuesStub = sinon.stub(FormController.prototype, 'getValues')
      getValuesStub.callsFake((req, res, valuesCallback) => {
        valuesCallback(null, { foo: 'bar' })
      })
      req = {
        form: {
          options: {},
        },
        services: {
          person: personService,
        },
      }
      res = {
        locals: {},
      }
    })

    context('when req.initialStep is false', function () {
      it('should not call the getUpdateValues method', function () {
        controller.getValues(req, res, callback)
        expect(controller.getUpdateValues).to.be.calledOnceWithExactly(req, res)
      })

      it('should call the protectReadOnlyFields method with the correct args', function () {
        controller.getValues(req, res, callback)
        expect(controller.protectReadOnlyFields).to.be.calledOnceWithExactly(
          req,
          {
            baz: 'tastic',
          }
        )
      })

      it('should invoke the callback', function () {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(null, { foo: 'bar' })
      })
    })

    context('when req.initialStep is true', function () {
      beforeEach(function () {
        req.initialStep = true
      })

      it('should call the getUpdateValues method with the correct args', function () {
        controller.getValues(req, res, callback)
        expect(controller.getUpdateValues).to.be.calledOnceWithExactly(req, res)
      })

      it('should call the protectReadOnlyFields method with the correct args', function () {
        controller.getValues(req, res, callback)
        expect(controller.protectReadOnlyFields).to.be.calledOnceWithExactly(
          req,
          {
            baz: 'tastic',
          }
        )
      })

      it('should invoke the callback with the correct args', function () {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(null, {
          baz: 'tastic',
        })
      })
    })

    context('when super.getUpdateValues passes an error', function () {
      let err

      beforeEach(function () {
        err = new Error()
        getValuesStub.callsFake((req, res, valuesCallback) => {
          valuesCallback(err, { foo: 'bar' })
        })
      })

      it('should invoke the callback with the error', function () {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(err)
      })
    })

    context('when this.getUpdateValues throws an error', function () {
      let err

      beforeEach(function () {
        req.initialStep = true
        req.form.options.update = true
        err = new Error()
        controller.getUpdateValues.restore()
        sinon.stub(controller, 'getUpdateValues').throws(err)
      })

      it('should invoke the callback with the error', function () {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(err)
      })
    })
  })

  describe('#getUpdateValues()', function () {
    const req = { services: { person: personService } }

    beforeEach(function () {
      req.getPerson = sinon.stub()
      personService.unformat.resetHistory().returns({})
    })

    context('when default getUpdateValues method invoked', function () {
      it('should return an empty object', function () {
        const values = controller.getUpdateValues(req, {})
        expect(values).to.deep.equal({})
      })
    })
  })

  describe('#protectReadOnlyFields()', function () {
    const unprotectedComponent = {
      component: 'a',
      prop: false,
      updateComponent: {
        component: 'b',
        prop: true,
        anotherProp: true,
      },
    }
    const protectedComponent = cloneDeep(unprotectedComponent)
    protectedComponent.readOnly = true

    const fields = {
      unprotected: cloneDeep(unprotectedComponent),
      protectedUndef: cloneDeep(protectedComponent),
      protectedNull: cloneDeep(protectedComponent),
      protected: cloneDeep(protectedComponent),
    }
    let req
    const values = {
      unprotected: 'unprotected-value',
      protectedNull: null,
      protected: 'protected-value',
    }

    beforeEach(function () {
      req = {
        form: {
          options: {
            fields: cloneDeep(fields),
          },
        },
      }
    })

    it('should leave unprotected fields unchanged', function () {
      controller.protectReadOnlyFields(req, values)
      const { unprotected } = req.form.options.fields
      expect(unprotected).to.deep.equal(fields.unprotected)
    })

    it('should leave protected fields that have no value unchanged', function () {
      controller.protectReadOnlyFields(req, values)
      const { protectedUndef } = req.form.options.fields
      expect(protectedUndef).to.deep.equal(fields.protectedUndef)
    })

    it('should leave protected fields that have null value unchanged', function () {
      controller.protectReadOnlyFields(req, values)
      const { protectedNull } = req.form.options.fields
      expect(protectedNull).to.deep.equal(fields.protectedNull)
    })

    it('should update component of protected fields that have a value', function () {
      controller.protectReadOnlyFields(req, values)
      const { protected: protectedField } = req.form.options.fields
      expect(protectedField.component).to.equal('b')
      expect(protectedField).to.have.property('prop', true)
      expect(protectedField).to.have.property('anotherProp', true)
    })
  })

  describe('#saveMove', function () {
    let req
    const res = {}
    let nextSpy, moveService

    beforeEach(function () {
      sinon.stub(controller, 'setFlash')
      moveService = {
        update: sinon.stub().resolves(),
      }
      req = {
        getMoveId: sinon.stub().returns('#moveId'),
        getMove: sinon.stub().returns({
          id: '#moveId',
        }),
        form: {
          options: {
            fields: {
              foo: {},
              bar: {},
            },
          },
          values: {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
        },
        services: {
          move: moveService,
        },
      }
      nextSpy = sinon.stub()
    })

    context('when the values have not changed', function () {
      beforeEach(async function () {
        req.getMove.returns({ foo: 'a', bar: 'b', baz: 'x' })
        await controller.saveMove(req, res, nextSpy)
      })

      it('should not update move', function () {
        expect(moveService.update).to.not.be.called
      })

      it('should not set the confirmation message', function () {
        expect(controller.setFlash).to.not.be.called
      })

      it('should invoke next with no error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when the values have changed', function () {
      const updatedMove = { id: '#updated' }

      beforeEach(async function () {
        req.services.move.update = sinon.stub().resolves(updatedMove)
        await controller.saveMove(req, res, nextSpy)
      })

      it('should call update with expected data', function () {
        expect(moveService.update).to.be.calledOnceWithExactly({
          id: '#moveId',
          foo: 'a',
          bar: 'b',
        })
      })

      it('should set the confirmation message', function () {
        expect(controller.setFlash).to.be.calledOnceWithExactly(req)
      })

      it('should invoke next with no error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when an error is thrown', function () {
      let error

      beforeEach(async function () {
        error = new Error()
        req.services.move.update = sinon.stub().rejects(error)
        await controller.saveMove(req, res, nextSpy)
      })

      it('should invoke next with the error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(error)
      })
    })
  })

  describe('#setFlash', function () {
    let req

    beforeEach(function () {
      req = {
        t: sinon.stub().returnsArg(0),
        flash: sinon.spy(),
        form: {
          options: {
            key: 'optionsKey',
          },
        },
        getMove: sinon.stub().returns({
          supplier: {
            name: 'Supplier A',
          },
        }),
      }
    })

    context('when the supplier is known', function () {
      beforeEach(function () {
        controller.setFlash(req, 'categoryKey')
      })

      it('should output localised strings containing the suppliers', function () {
        expect(req.t).to.be.callCount(2)
        expect(req.t.getCall(0).args).to.deep.equal([
          'moves::update_flash.categories.categoryKey.heading',
        ])
        expect(req.t.getCall(1).args).to.deep.equal([
          'moves::update_flash.categories.categoryKey.message',
          { supplier: 'Supplier A' },
        ])
      })
    })

    context('when the supplier is not known', function () {
      beforeEach(function () {
        req.getMove = sinon.stub().returns({})
        controller.setFlash(req, 'categoryKey')
      })

      it('should output localised strings containing generic supplier info', function () {
        expect(req.t).to.be.callCount(3)
        expect(req.t.getCall(0).args).to.deep.equal(['supplier_fallback'])
        expect(req.t.getCall(1).args).to.deep.equal([
          'moves::update_flash.categories.categoryKey.heading',
        ])
        expect(req.t.getCall(2).args).to.deep.equal([
          'moves::update_flash.categories.categoryKey.message',
          {
            supplier: 'supplier_fallback',
          },
        ])
      })
    })

    context('when passed an explicit key', function () {
      beforeEach(function () {
        controller.flashKey = 'flashKey'
        controller.setFlash(req, 'categoryKey')
      })

      it('should set confirmation message using explicit key', function () {
        expect(req.flash).to.be.calledOnceWithExactly('success', {
          title: 'moves::update_flash.categories.categoryKey.heading',
          content: 'moves::update_flash.categories.categoryKey.message',
        })
      })
    })

    context(
      'when passed no explicit key but has a flashKey property',
      function () {
        beforeEach(function () {
          controller.flashKey = 'flashKey'
          controller.setFlash(req)
        })

        it('should set confirmation message using explicit key', function () {
          expect(req.flash).to.be.calledOnceWithExactly('success', {
            title: 'moves::update_flash.categories.flashKey.heading',
            content: 'moves::update_flash.categories.flashKey.message',
          })
        })
      }
    )

    context(
      'when passed no explicit key and has no flashKey property',
      function () {
        beforeEach(function () {
          delete controller.flashKey
          controller.setFlash(req)
        })

        it('should set confirmation message using explicit key', function () {
          expect(req.flash).to.be.calledOnceWithExactly('success', {
            title: 'moves::update_flash.categories.optionsKey.heading',
            content: 'moves::update_flash.categories.optionsKey.message',
          })
        })
      }
    )
  })
})
