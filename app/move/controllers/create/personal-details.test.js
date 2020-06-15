const FormController = require('hmpo-form-wizard').Controller

const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')
const personService = require('../../../../common/services/person')
const referenceDataService = require('../../../../common/services/reference-data')

const Controller = require('./personal-details')

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
const pncSearchTerm = '7654321'

describe('Move controllers', function () {
  describe('Personal Details', function () {
    describe('#configure()', function () {
      let nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
      })

      context('when getReferenceData returns 200', function () {
        let req

        beforeEach(function () {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(fieldHelpers, 'insertItemConditional').callsFake(() => {
            return item => item
          })
          sinon.stub(referenceDataService, 'getGenders').resolves(genderMock)
          sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
            return () => true
          })
          sinon
            .stub(referenceDataService, 'getEthnicities')
            .resolves(ethnicityMock)

          req = {
            query: {},
            form: {
              options: {
                fields: {
                  gender: {},
                  ethnicity: {},
                  police_national_computer: {},
                },
              },
            },
          }
        })

        context('without searchTerm', function () {
          beforeEach(async function () {
            await controller.configure(req, {}, nextSpy)
          })

          it('should set list of genders dynamically', function () {
            expect(req.form.options.fields.gender.items).to.deep.equal([
              { value: '8888', text: 'Male' },
              { value: '9999', text: 'Female' },
            ])
          })

          it('should insert trans conditional field', function () {
            expect(
              fieldHelpers.insertItemConditional
            ).to.have.been.calledOnceWithExactly({
              key: 'trans',
              field: 'gender_additional_information',
            })
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

        context('with searchTerm', function () {
          beforeEach(async function () {
            req.query.police_national_computer_search_term = pncSearchTerm
            await controller.configure(req, {}, nextSpy)
          })

          it('should set PNC form value default', function () {
            expect(
              req.form.options.fields.police_national_computer.default
            ).to.equal(pncSearchTerm)
          })
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

    describe('#savePerson()', function () {
      const mockId = '1234567'

      beforeEach(function () {
        sinon.stub(personService, 'create').resolves()
        sinon.stub(personService, 'update').resolves()
      })

      context('without id', function () {
        beforeEach(function () {
          controller.savePerson(undefined, personMock)
        })

        it('should create a person via the personService', function () {
          expect(personService.create).to.be.calledOnceWithExactly(personMock)
        })

        it('should not update a person via the personService', function () {
          expect(personService.update).to.not.be.called
        })
      })

      context('with id', function () {
        beforeEach(function () {
          controller.savePerson(mockId, personMock)
        })

        it('should update a person via the personService', function () {
          expect(personService.update).to.be.calledOnceWithExactly({
            id: mockId,
            ...personMock,
          })
        })

        it('should not create a person via the personService', function () {
          expect(personService.create).to.not.be.called
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
          getPerson: sinon.stub(),
          getPersonId: sinon.stub(),
        }
      })

      context('when save is successful', function () {
        context('with a new person', function () {
          beforeEach(async function () {
            sinon.stub(controller, 'savePerson').resolves(personMock)
            req.getPerson.returns(personMock)
            req.getPersonId.returns(personMock.id)

            await controller.saveValues(req, {}, nextSpy)
          })

          it('should save the persons data', function () {
            expect(controller.savePerson).to.be.calledOnceWithExactly(
              personMock.id,
              req.form.values
            )
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

        context('with a pre-existing person', function () {
          beforeEach(async function () {
            sinon.stub(controller, 'savePerson').resolves(personMock)
            req.getPerson.returns(undefined)

            await controller.saveValues(req, {}, nextSpy)
          })

          it('should save the persons data', function () {
            expect(controller.savePerson).to.be.calledOnceWithExactly(
              undefined,
              req.form.values
            )
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
