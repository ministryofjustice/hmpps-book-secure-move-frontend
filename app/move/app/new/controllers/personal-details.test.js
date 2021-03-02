const fieldHelpers = require('../../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../../common/helpers/reference-data')

const CreateBaseController = require('./base')
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
        let req, referenceDataService

        beforeEach(function () {
          referenceDataService = {
            getGenders: sinon.stub().resolves(genderMock),
            getEthnicities: sinon.stub().resolves(ethnicityMock),
          }
          sinon.spy(CreateBaseController.prototype, 'configure')
          sinon.stub(fieldHelpers, 'insertItemConditional').callsFake(() => {
            return item => item
          })
          sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
            return () => true
          })

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
            services: {
              referenceData: referenceDataService,
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
            expect(CreateBaseController.prototype.configure).to.be.calledOnce
            expect(CreateBaseController.prototype.configure).to.be.calledWith(
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
        const referenceDataService = {
          getGenders: sinon.stub().throws(errorMock),
        }
        const req = {
          services: {
            referenceData: referenceDataService,
          },
        }

        beforeEach(async function () {
          await controller.configure(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not mutate request object', function () {
          expect(req).to.deep.equal({
            services: {
              referenceData: referenceDataService,
            },
          })
        })
      })
    })

    describe('#saveValues()', function () {
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(CreateBaseController.prototype, 'saveValues')
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {
              foo: 'bar',
              fizz: 'buzz',
            },
          },
          services: {
            person: {
              create: sinon.stub(),
              update: sinon.stub(),
            },
          },
          sessionModel: {
            get: sinon.stub(),
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(function () {
          req.services.person.create.returns(personMock)
          req.services.person.update.returns({
            ...personMock,
            updated: true,
          })
        })

        context('without an existing person', function () {
          beforeEach(async function () {
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should create a new person', function () {
            expect(req.services.person.create).to.be.calledOnceWithExactly({
              foo: 'bar',
              fizz: 'buzz',
            })
          })

          it('should set person response on form values', function () {
            expect(req.form.values).to.have.property('person')
            expect(req.form.values.person).to.deep.equal(personMock)
            expect(req.form.values.newPersonId).to.equal(personMock.id)
          })

          it('should call parent controller', function () {
            expect(
              CreateBaseController.prototype.saveValues
            ).to.be.calledOnceWithExactly(req, {}, nextSpy)
          })
        })

        context('with a pre-existing person', function () {
          beforeEach(function () {
            req.sessionModel.get.withArgs('person').returns(personMock)
          })

          context('when existing person ID does match', function () {
            beforeEach(async function () {
              req.sessionModel.get
                .withArgs('newPersonId')
                .returns(personMock.id)
              await controller.saveValues(req, {}, nextSpy)
            })

            it('should update the persons data', function () {
              expect(req.services.person.update).to.be.calledOnceWithExactly({
                foo: 'bar',
                fizz: 'buzz',
                id: personMock.id,
              })
            })

            it('should set update response on form values', function () {
              expect(req.form.values).to.have.property('person')
              expect(req.form.values.person).to.deep.equal({
                ...personMock,
                updated: true,
              })
            })

            it('should call parent controller', function () {
              expect(
                CreateBaseController.prototype.saveValues
              ).to.be.calledOnceWithExactly(req, {}, nextSpy)
            })
          })

          context('when existing person ID does not match', function () {
            beforeEach(async function () {
              req.sessionModel.get.withArgs('newPersonId').returns('12345')
              await controller.saveValues(req, {}, nextSpy)
            })

            it('should create a new person', function () {
              expect(req.services.person.create).to.be.calledOnceWithExactly({
                foo: 'bar',
                fizz: 'buzz',
              })
            })

            it('should set person response on form values', function () {
              expect(req.form.values).to.have.property('person')
              expect(req.form.values.person).to.deep.equal(personMock)
              expect(req.form.values.newPersonId).to.equal(personMock.id)
            })

            it('should call parent controller', function () {
              expect(
                CreateBaseController.prototype.saveValues
              ).to.be.calledOnceWithExactly(req, {}, nextSpy)
            })
          })
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          req.services.person.create.throws(errorMock).resetHistory()
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
