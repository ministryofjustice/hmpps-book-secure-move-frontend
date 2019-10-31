const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./pnc-search-results')
const personService = require('../../../../common/services/person')
const componentService = require('../../../../common/services/component')
const fieldHelpers = require('../../../../common/helpers/field')

const controller = new Controller({ route: '/' })

const personMock = {
  id: '3333',
  first_names: 'Foo',
  last_name: 'Bar',
  fullname: 'Foo, Bar',
  date_of_birth: '1952-07-02',
  gender: {
    id: '5555',
    title: 'Female',
  },
  ethnicity: {
    id: '7777',
    title: 'Foo',
  },
  identifiers: [
    {
      identifier_type: 'police_national_computer',
      value: '1111',
    },
  ],
}
const personMockOne = {
  id: '4444',
  first_names: 'Baz',
  last_name: 'Boo',
  fullname: 'Baz, Boo',
  date_of_birth: '1948-04-24',
  gender: {
    id: '9999',
    title: 'Trans',
  },
  ethnicity: {
    id: '8888',
    title: 'Foo',
  },
  identifiers: [
    {
      identifier_type: 'police_national_computer',
      value: '2222',
    },
  ],
}
const pncSearchTerm = '1234567'

describe('Move controllers', function() {
  describe('Pnc Search Results', function() {
    describe('#configure()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        sinon.spy(FormController.prototype, 'configure')
        sinon.spy(fieldHelpers, 'mapPersonToOption')
        sinon.stub(componentService, 'getComponent').returnsArg(0)

        req = {
          query: {},
          form: {
            options: {
              fields: {
                police_national_computer_search_term_result: {
                  items: [],
                },
              },
            },
          },
        }

        res = {
          locals: {},
          redirect: sinon.spy(),
        }
        nextSpy = sinon.spy()
      })

      context('with a search term', function() {
        beforeEach(function() {
          req.query.police_national_computer_search_term = pncSearchTerm
        })

        context('with results', function() {
          beforeEach(async function() {
            sinon
              .stub(personService, 'findAll')
              .resolves([personMock, personMockOne])

            await controller.configure(req, res, nextSpy)
          })

          it('should populate search_results field items', function() {
            expect(
              req.form.options.fields
                .police_national_computer_search_term_result.items
            ).to.deep.equal([
              {
                hint: {
                  html: 'appResults',
                },
                label: {
                  classes: 'govuk-label--s',
                },
                text: 'FOO, BAR',
                value: '3333',
              },
              {
                hint: {
                  html: 'appResults',
                },
                label: {
                  classes: 'govuk-label--s',
                },
                text: 'BAZ, BOO',
                value: '4444',
              },
            ])
          })

          it('should populate people locals as expected', function() {
            expect(res.locals.people).to.deep.equal([personMock, personMockOne])
          })

          it('should populate pncSearchTerm locals as expected', function() {
            expect(res.locals.pncSearchTerm).to.equal(pncSearchTerm)
          })

          it('should set police_national_computer_search_term_result validate property', function() {
            expect(
              req.form.options.fields
                .police_national_computer_search_term_result
            ).to.have.property('validate')
            expect(
              req.form.options.fields
                .police_national_computer_search_term_result.validate
            ).to.equal('required')
          })

          it('should call parent configure method', function() {
            expect(FormController.prototype.configure).to.be.calledOnce
            expect(FormController.prototype.configure).to.be.calledWith(
              req,
              res,
              nextSpy
            )
          })

          it('should not throw an error', function() {
            expect(nextSpy).to.be.calledOnce
            expect(nextSpy).to.be.calledWith()
          })
        })

        context('without results', function() {
          beforeEach(async function() {
            sinon.stub(personService, 'findAll').resolves([])

            await controller.configure(req, res, nextSpy)
          })

          it('should populate people locals as expected', function() {
            expect(res.locals.people).to.deep.equal([])
          })

          it('should populate pncSearchTerm locals as expected', function() {
            expect(res.locals.pncSearchTerm).to.equal(pncSearchTerm)
          })

          it('should remove police_national_computer_search_term_result field', function() {
            expect(
              req.form.options.fields
                .police_national_computer_search_term_result
            ).to.be.undefined
          })

          it('should call redirect as expected', function() {
            expect(res.redirect).to.be.calledOnce
            expect(res.redirect).to.be.calledWithExactly(
              `/move/new/personal-details?police_national_computer_search_term=${pncSearchTerm}`
            )
          })

          it('should not call parent configure method', function() {
            expect(FormController.prototype.configure).to.not.be.called
          })

          it('should not throw an error', function() {
            expect(nextSpy).to.not.be.called
          })
        })

        context('when personService returns an error', function() {
          const errorMock = new Error('Problem')

          beforeEach(async function() {
            sinon.stub(personService, 'findAll').throws(errorMock)

            await controller.configure(req, res, nextSpy)
          })

          it('should call next with the error', function() {
            expect(nextSpy).to.be.calledWith(errorMock)
          })

          it('should call next once', function() {
            expect(nextSpy).to.be.calledOnce
          })

          it('should not populate people locals', function() {
            expect(res.locals.people).to.be.undefined
          })

          it('should not populate pncSearchTerm locals', function() {
            expect(res.locals.pncSearchTerm).to.be.undefined
          })
        })
      })

      context('without a pnc search term', function() {
        beforeEach(async function() {
          sinon.stub(personService, 'findAll').resolves([])

          await controller.configure(req, res, nextSpy)
        })

        it('should not populate people locals', function() {
          expect(res.locals.people).to.be.undefined
        })

        it('should not populate pncSearchTerm locals', function() {
          expect(res.locals.pncSearchTerm).to.be.undefined
        })

        it('should remove police_national_computer_search_term_result field', function() {
          expect(
            req.form.options.fields.police_national_computer_search_term_result
          ).to.be.undefined
        })

        it('should call redirect as expected', function() {
          expect(res.redirect).to.be.calledOnce
          expect(res.redirect).to.be.calledWithExactly(
            '/move/new/personal-details'
          )
        })

        it('should not call parent configure method', function() {
          expect(FormController.prototype.configure).to.not.be.called
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.not.be.called
        })
      })
    })

    describe('#saveValues()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        sinon.spy(FormController.prototype, 'saveValues')
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
        req = {
          body: {},
          form: {
            values: {},
          },
          sessionModel: {
            set: sinon.stub(),
            unset: sinon.stub(),
          },
        }
      })

      context('without personId', function() {
        beforeEach(async function() {
          await controller.saveValues(req, res, nextSpy)
        })

        it('should not mutate form values', function() {
          expect(req.form.values).to.deep.equal({})
        })

        it('should call parent saveValues method', function() {
          expect(FormController.prototype.saveValues).to.be.calledOnce
          expect(FormController.prototype.saveValues).to.be.calledWith(
            req,
            res,
            nextSpy
          )
        })
      })

      context('with personId', function() {
        beforeEach(async function() {
          req.body.police_national_computer_search_term_result = '4444'
          res.locals.people = [personMock, personMockOne]

          await controller.saveValues(req, res, nextSpy)
        })

        it('should populate form values as expected', function() {
          expect(req.form.values).to.deep.equal({
            date_of_birth: '1948-04-24',
            ethnicity: '8888',
            first_names: 'Baz',
            fullname: 'Baz, Boo',
            gender: '9999',
            id: '4444',
            identifiers: [
              {
                identifier_type: 'police_national_computer',
                value: '2222',
              },
            ],
            last_name: 'Boo',
            person: {
              date_of_birth: '1948-04-24',
              ethnicity: {
                id: '8888',
                title: 'Foo',
              },
              first_names: 'Baz',
              fullname: 'Baz, Boo',
              gender: {
                id: '9999',
                title: 'Trans',
              },
              id: '4444',
              identifiers: [
                {
                  identifier_type: 'police_national_computer',
                  value: '2222',
                },
              ],
              last_name: 'Boo',
            },
            police_national_computer: '2222',
          })
        })

        it('should call parent saveValues method', function() {
          expect(FormController.prototype.saveValues).to.be.calledOnce
          expect(FormController.prototype.saveValues).to.be.calledWith(
            req,
            res,
            nextSpy
          )
        })

        it('should set response to session model', function() {
          expect(req.sessionModel.set).to.be.calledWith()
        })
      })
    })
  })
})
