const FormController = require('hmpo-form-wizard').Controller

const BaseController = require('./base')
const Controller = require('./person-search')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Create Person Search controller', function () {
    describe('#successHandler()', function () {
      let req, res

      beforeEach(function () {
        sinon
          .stub(FormController.prototype, 'getNextStep')
          .returns('/next-step')
        sinon.stub(FormController.prototype, 'setStepComplete')
        req = {
          body: {},
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('with filters', function () {
        context('with one filter', function () {
          beforeEach(function () {
            req.body = {
              'filter.police_national_computer': 'ABCD',
            }
            controller.successHandler(req, res)
          })

          it('should set step complete', function () {
            expect(
              FormController.prototype.setStepComplete
            ).to.be.calledOnceWithExactly(req, res)
          })

          it('should redirect with search', function () {
            expect(res.redirect).to.be.calledOnceWithExactly(
              '/next-step?filter[police_national_computer]=ABCD'
            )
          })
        })

        context('with multiple filters', function () {
          beforeEach(function () {
            req.body = {
              'filter.police_national_computer': 'ABCD',
              'filter.prison_number': '1234',
              'filter.cro_number': 'EFGH',
            }
            controller.successHandler(req, res)
          })

          it('should set step complete', function () {
            expect(
              FormController.prototype.setStepComplete
            ).to.be.calledOnceWithExactly(req, res)
          })

          it('should redirect with search', function () {
            expect(res.redirect).to.be.calledOnceWithExactly(
              '/next-step?filter[police_national_computer]=ABCD&filter[prison_number]=1234&filter[cro_number]=EFGH'
            )
          })
        })
      })

      context('without filters', function () {
        beforeEach(function () {
          controller.successHandler(req, res)
        })

        it('should set step complete', function () {
          expect(
            FormController.prototype.setStepComplete
          ).to.be.calledOnceWithExactly(req, res)
        })

        it('should redirect without search', function () {
          expect(res.redirect).to.be.calledOnceWithExactly('/next-step')
        })
      })
    })

    describe('#saveValues()', function () {
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'saveValues')
        req = {
          form: {
            values: {},
          },
        }
        nextSpy = sinon.spy()
      })

      context('when filter has a value', function () {
        beforeEach(function () {
          req.form.values['filter.police_national_computer'] = '12345'
          controller.saveValues(req, {}, nextSpy)
        })

        it('should set PNC number', function () {
          expect(req.form.values.police_national_computer).to.equal('12345')
        })

        it('should call parent method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('when filter does not have a value', function () {
        beforeEach(function () {
          controller.saveValues(req, {}, nextSpy)
        })

        it('should set PNC number', function () {
          expect(req.form.values.police_national_computer).to.be.undefined
        })

        it('should call parent method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })
    })
  })
})
