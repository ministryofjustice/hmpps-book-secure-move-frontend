const mockPopulationService = {
  create: sinon.stub(),
  update: sinon.stub(),
}

const FormWizardController = require('../../../../common/controllers/form-wizard')

const Controller = require('./details')

describe('Population controllers', function () {
  describe('details controller', function () {
    let req
    let res
    let next
    let controllerInstance
    let sessionData

    beforeEach(function () {
      sessionData = { key: 'value' }
      req = {
        baseUrl: '/base-url',
        date: '2020-06-01',
        location: { id: 'DEADBEEF' },
        session: {
          user: {
            fullname: 'Lorem Ipsum',
          },
        },
        sessionModel: {
          toJSON: sinon.stub().returns(sessionData),
          reset: sinon.fake(),
          set: sinon.fake(),
          options: {
            fields: {
              unlock: {},
              discharges: {},
            },
          },
        },
        journeyModel: {
          reset: sinon.fake(),
          get: sinon.stub(),
        },
        form: {
          options: {
            fullPath: '/details',
          },
        },
        services: {
          population: mockPopulationService,
        },
        t: sinon.stub().returnsArg(0),
      }
      res = {
        redirect: sinon.fake(),
        breadcrumb: sinon.fake(),
        locals: {},
      }

      next = sinon.fake()

      controllerInstance = new Controller({ route: '/' })
    })

    describe('middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controllerInstance, 'use')

        controllerInstance.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set breadcumbs method', function () {
        expect(
          controllerInstance.use.getCall(0)
        ).to.have.been.calledWithExactly(controllerInstance.setBreadcrumbs)
      })

      it('should call set cancel url method', function () {
        expect(
          controllerInstance.use.getCall(1)
        ).to.have.been.calledWithExactly(controllerInstance.setCancelUrl)
      })

      it('should call set page title method', function () {
        expect(
          controllerInstance.use.getCall(2)
        ).to.have.been.calledWithExactly(controllerInstance.setPageTitle)
      })

      it('should call set hint text method', function () {
        expect(
          controllerInstance.use.getCall(3)
        ).to.have.been.calledWithExactly(controllerInstance.setHintText)
      })

      it('should call correct number of middleware', function () {
        expect(controllerInstance.use).to.be.callCount(4)
      })
    })

    describe('successHandler', function () {
      context('creating a new population', function () {
        it('should call create on the population service', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(mockPopulationService.create).to.have.been.called
          expect(mockPopulationService.create).to.have.been.calledWith({
            location: req.location.id,
            date: req.date,
            updated_by: req.session.user.fullname,
            ...sessionData,
          })
        })

        it('should reset the journey model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).to.have.been.calledWith()
        })

        it('should reset the session model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.sessionModel.reset).to.have.been.calledWith()
        })

        it('should redirect back to the population page', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(res.redirect).to.have.been.calledWith(
            `/population/day/${req.date}/${req.location.id}`
          )
        })

        it('should call next on failure', async function () {
          const error = new Error('Failure')
          req.services.population.create = sinon.stub().rejects(error)

          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).not.to.have.been.called
          expect(req.sessionModel.reset).not.to.have.been.called
          expect(next).to.have.been.calledWith(error)
        })
      })

      context('editing an existing population', function () {
        beforeEach(function () {
          req.population = {
            id: 'ABADCAFE',
          }
        })

        it('should call update on the population service', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(mockPopulationService.update).to.have.been.calledWith({
            id: req.population.id,
            updated_by: req.session.user.fullname,
            ...sessionData,
          })
        })
        it('should reset the journey model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).to.have.been.calledWith()
        })
        it('should reset the session model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.sessionModel.reset).to.have.been.calledWith()
        })
        it('should redirect back to the population page', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(res.redirect).to.have.been.calledWith(
            `/population/day/${req.date}/${req.location.id}`
          )
        })

        it('should call next on failure', async function () {
          const error = new Error('Failure')
          req.services.population.update = sinon.stub().rejects(error)

          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).not.to.have.been.called
          expect(req.sessionModel.reset).not.to.have.been.called
          expect(next).to.have.been.calledWith(error)
        })
      })
    })

    describe('errorHandler', function () {
      const errorMock = new Error('Mock error!')

      beforeEach(function () {
        sinon.spy(FormWizardController.prototype, 'errorHandler')
      })

      context('when it returns missing prereq error', function () {
        beforeEach(function () {
          errorMock.code = 'MISSING_PREREQ'

          controllerInstance.errorHandler(errorMock, req, res, next)
        })

        it('should redirect to base URL', function () {
          expect(res.redirect).to.be.calledOnceWithExactly(req.baseUrl)
        })

        it('should not call parent error handler', function () {
          expect(FormWizardController.prototype.errorHandler).not.to.be.called
        })
      })

      context('when any other error', function () {
        beforeEach(function () {
          errorMock.code = 'ERROR_CODE'
          controllerInstance.errorHandler(errorMock, req, res, next)
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.be.called
        })

        it('should call parent error handler', function () {
          expect(FormWizardController.prototype.errorHandler).to.be.calledWith(
            errorMock,
            req,
            res,
            next
          )
        })
      })
    })

    describe('setBreadcrumbs', function () {
      context('with an existing population', function () {
        beforeEach(function () {
          req.population = {}
          controllerInstance.setBreadcrumbs(req, res, next)
        })
        it('should use update page title', function () {
          expect(req.t).to.have.been.calledWith(
            'population::edit.page_title_update'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('with an new population', function () {
        beforeEach(async function () {
          await controllerInstance.setBreadcrumbs(req, res, next)
        })
        it('should use new page title', function () {
          expect(req.t).to.have.been.calledWith(
            'population::edit.page_title_new'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })

    describe('setCancelUrl', function () {
      context('with an existing population', function () {
        beforeEach(function () {
          req.date = '2020-06-01'
          req.location.id = 'ABADCAFE'
          req.population = {}
          controllerInstance.setCancelUrl(req, res, next)
        })
        it('should use change text', function () {
          expect(res.locals.cancelUrl).to.equal(
            '/population/day/2020-06-01/ABADCAFE'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('with an new population', function () {
        beforeEach(async function () {
          req.date = '2020-06-01'
          await controllerInstance.setCancelUrl(req, res, next)
        })
        it('should use add text', function () {
          expect(res.locals.cancelUrl).to.equal('/population/week/2020-06-01')
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })

    describe('setPageTitle', function () {
      context('with an existing population', function () {
        beforeEach(function () {
          req.population = {}
          controllerInstance.setPageTitle(req, res, next)
        })
        it('should use change text', function () {
          expect(req.form.options.pageTitle).to.equal(
            'population::edit.page_title_update'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('with an new population', function () {
        beforeEach(async function () {
          await controllerInstance.setPageTitle(req, res, next)
        })
        it('should use add text', function () {
          expect(req.form.options.pageTitle).to.equal(
            'population::edit.page_title_new'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })

    describe('#setHintText', function () {
      context('creating a new population', function () {
        beforeEach(function () {
          controllerInstance.setHintText(req, res, next)
        })
        it('should update the hint text for unlock', function () {
          expect(req.sessionModel.options.fields.unlock.hint?.text).to.equal(
            'messages::external_data.nomis'
          )
        })
        it('should update the hint text for discharges', function () {
          expect(req.sessionModel.options.fields.unlock.hint?.text).to.equal(
            'messages::external_data.nomis'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('editing an existing population', function () {
        beforeEach(function () {
          req.population = {
            id: 'ABADCAFE',
          }

          controllerInstance.setHintText(req, res, next)
        })

        it('should not update the hint text for unlock', function () {
          expect(req.sessionModel.options.fields.unlock.hint?.text).to.be
            .undefined
        })
        it('should not update the hint text for discharges', function () {
          expect(req.sessionModel.options.fields.discharges.hint?.text).to.be
            .undefined
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })

    describe('stringifyValues', function () {
      it('should stringify numeric input values', function () {
        expect(
          controllerInstance.stringifyValues({
            fields: {
              numberField1: {
                inputmode: 'numeric',
              },
            },
            values: { numberField1: 0 },
          })
        ).to.deep.equal({ numberField1: '0' })
      })

      it('should stringify missing numeric input values', function () {
        expect(
          controllerInstance.stringifyValues({
            fields: {
              numberField1: {
                inputmode: 'numeric',
              },
            },
            values: { numberField1: null },
          })
        ).to.deep.equal({ numberField1: '' })
      })

      it('should not stringify non-numeric input values', function () {
        expect(
          controllerInstance.stringifyValues({
            fields: {
              numberField1: {},
            },
            values: { numberField1: 0 },
          })
        ).to.deep.equal({ numberField1: 0 })
      })
    })

    describe('getValues', function () {
      let cb
      let values
      let stringedValues

      beforeEach(function () {
        values = {
          numberField1: 0,
          textField1: 'string value',
          numberField2: 1,
        }
        stringedValues = {
          numberField1: '0',
          textField1: 'string value',
          numberField2: '1',
        }
        req.form.options.fields = {
          numberField1: {
            inputmode: 'numeric',
          },
          textField1: {},
          numberField2: {
            inputmode: 'numeric',
          },
        }
        sinon.stub(FormWizardController.prototype, 'getValues')
        sinon.stub(controllerInstance, 'stringifyValues')

        cb = sinon.stub()
      })

      it('should call parent getValues', function () {
        controllerInstance.getValues(req, res, cb)

        expect(FormWizardController.prototype.getValues).to.have.been.calledOnce
      })

      context('on parent response with error', function () {
        let err
        beforeEach(function () {
          err = new Error('Super error')
          FormWizardController.prototype.getValues.callsArgWith(2, err, values)

          controllerInstance.getValues(req, res, cb)
        })
        it('should not call stringifyValues', function () {
          expect(controllerInstance.stringifyValues).not.to.have.been.called
        })
        it('should call callback with error and values', function () {
          expect(cb).to.have.been.calledWith(err, values)
        })
      })
      context('on parent response without error', function () {
        beforeEach(function () {
          controllerInstance.stringifyValues.returns(stringedValues)
          FormWizardController.prototype.getValues.callsArgWith(2, null, values)

          controllerInstance.getValues(req, res, cb)
        })

        it('should call stringifyValues', function () {
          controllerInstance.getValues(req, res, cb)

          expect(
            controllerInstance.stringifyValues
          ).to.have.been.calledWithExactly({
            fields: req.form.options.fields,
            values,
          })
        })

        it('should call callback with error and stringed values', function () {
          expect(cb).to.have.been.calledWith(null, stringedValues)
        })
      })
    })
  })
})
