const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./new.personal-details')
const personService = require('../../../common/services/person')
const referenceDataService = require('../../../common/services/reference-data')

const controller = new Controller({ route: '/' })
const genderMock = [
  {
    id: '8888',
    title: 'Male',
  },
  {
    id: '9999',
    title: 'Female',
  },
]
const ethnicityMock = [
  {
    id: '3333',
    title: 'Foo',
  },
  {
    id: '4444',
    title: 'Bar',
  },
]
const personMock = {
  id: '3333',
  first_names: 'Foo',
  last_name: 'Bar',
}

describe('Move controllers', function () {
  describe('Personal Details', function () {
    describe('#configure()', function () {
      let nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
      })

      context('when getReferenceData returns 200', function () {
        let req

        beforeEach(async function () {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(referenceDataService, 'getGenders').resolves(genderMock)
          sinon
            .stub(referenceDataService, 'getEthnicities')
            .resolves(ethnicityMock)

          req = {
            form: {
              options: {
                fields: {
                  gender: {},
                  ethnicity: {},
                },
              },
            },
          }

          await controller.configure(req, {}, nextSpy)
        })

        it('should set list of genders dynamically', function () {
          expect(req.form.options.fields.gender.items).to.deep.equal([
            { value: '8888', text: 'Male' },
            { value: '9999', text: 'Female' },
          ])
        })

        it('should set list of ethnicities dynamically', function () {
          expect(req.form.options.fields.ethnicity.items).to.deep.equal([
            { text: '--- Choose ethnicity ---' },
            { value: '3333', text: 'Foo' },
            { value: '4444', text: 'Bar' },
          ])
        })

        it('should call parent configure method', function () {
          expect(FormController.prototype.configure).to.be.calledOnce
          expect(FormController.prototype.configure).to.be.calledWith(
            req,
            {},
            nextSpy
          )
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when getReferenceData returns an error', function () {
        const errorMock = new Error('Problem')
        const req = {}

        beforeEach(async function () {
          sinon.stub(referenceDataService, 'getGenders').throws(errorMock)

          await controller.configure(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not mutate request object', function () {
          expect(req).to.deep.equal({})
        })
      })
    })

    describe('#saveValues()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(personService, 'create').resolves(personMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should set person response on form values', function () {
          expect(req.form.values).to.have.property('person')
          expect(req.form.values.person).to.deep.equal(personMock)
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          sinon.stub(personService, 'create').throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not set person response on form values', function () {
          expect(req.form.values).not.to.have.property('person')
        })
      })
    })
  })
})
