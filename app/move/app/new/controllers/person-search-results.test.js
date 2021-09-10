const presenters = require('../../../../../common/presenters')
const componentService = require('../../../../../common/services/component')
const personService = {
  getByIdentifiers: sinon.stub(),
}

const PersonController = require('./person')
const Controller = require('./person-search-results')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Create Person controller', function () {
    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(PersonController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setPeople')
        sinon.stub(controller, 'setPeopleItems')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(PersonController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call setPeople middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setPeople
        )
      })

      it('should call setPeopleItems middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.setPeopleItems
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(PersonController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkFilter')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(PersonController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkFilter middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkFilter
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#setPeople()', function () {
      let req, nextSpy

      beforeEach(function () {
        req = {
          query: {},
          services: {
            person: personService,
          },
        }
        nextSpy = sinon.spy()
        personService.getByIdentifiers.resetHistory()
      })

      context('when query contains filter', function () {
        beforeEach(function () {
          req.query.filter = {
            foo: 'bar',
          }
        })

        context('when person service resolves', function () {
          const mockResponse = [1, 2, 3, 4]

          beforeEach(async function () {
            personService.getByIdentifiers.resolves(mockResponse)
            await controller.setPeople(req, {}, nextSpy)
          })

          it('should call service', function () {
            expect(personService.getByIdentifiers).to.be.calledOnceWithExactly(
              req.query.filter
            )
          })

          it('should set req.people to empty array', function () {
            expect(req).to.have.property('people')
            expect(req.people).to.deep.equal(mockResponse)
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when person service errors', function () {
          const mockError = new Error('failed')

          beforeEach(async function () {
            personService.getByIdentifiers.rejects(mockError)
            await controller.setPeople(req, {}, nextSpy)
          })

          it('should call service', function () {
            expect(personService.getByIdentifiers).to.be.calledOnceWithExactly(
              req.query.filter
            )
          })

          it('should set req.people to empty array', function () {
            expect(req).to.have.property('people')
            expect(req.people).to.deep.equal([])
          })

          it('should call next with error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(mockError)
          })
        })
      })

      context('when query does not contain filter', function () {
        beforeEach(async function () {
          await controller.setPeople(req, {}, nextSpy)
        })

        it('should not call service', function () {
          expect(personService.getByIdentifiers).not.to.be.called
        })

        it('should set req.people to empty array', function () {
          expect(req).to.have.property('people')
          expect(req.people).to.deep.equal([])
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setPeopleItems()', function () {
      Object.entries({
        prison_number: 'prison',
        police_national_computer: 'other',
      }).forEach(([filterType, locationType]) => {
        let req, nextSpy, profileToCardComponentStub
        context(`when searching by ${filterType}`, function () {
          beforeEach(function () {
            profileToCardComponentStub = sinon.stub().returnsArg(0)
            sinon.stub(componentService, 'getComponent').returnsArg(0)
            sinon
              .stub(presenters, 'profileToCardComponent')
              .callsFake(() => profileToCardComponentStub)
            req = {
              sessionModel: {
                toJSON: sinon
                  .stub()
                  .returns({ from_location_type: locationType }),
              },
              people: [],
              form: {
                options: {
                  fields: {
                    people: {},
                  },
                },
              },
              query: {
                filter: {},
              },
            }
            req.query.filter[filterType] = 123
            nextSpy = sinon.spy()
          })

          context('with multiple results', function () {
            const mockPeople = [
              {
                id: 1,
                name: 'foo',
              },
              {
                id: 2,
                name: 'bar',
              },
            ]

            beforeEach(function () {
              req.people = mockPeople
              controller.setPeopleItems(req, {}, nextSpy)
            })

            it('should set people items property', function () {
              expect(req.form.options.fields.people.items).to.deep.equal([
                {
                  value: 1,
                  checked: false,
                  html: 'appCard',
                },
                {
                  value: 2,
                  checked: false,
                  html: 'appCard',
                },
              ])
            })

            it('should call presenter correct number of times', function () {
              expect(presenters.profileToCardComponent.callCount).to.equal(2)
            })

            it('should call presenter correctly', function () {
              expect(
                presenters.profileToCardComponent.firstCall
              ).to.be.calledWithExactly({ locationType, showTags: false })
              expect(
                profileToCardComponentStub.firstCall
              ).to.be.calledWithExactly({ profile: { person: mockPeople[0] } })
              expect(
                presenters.profileToCardComponent.secondCall
              ).to.be.calledWithExactly({ locationType, showTags: false })
              expect(
                profileToCardComponentStub.secondCall
              ).to.be.calledWithExactly({ profile: { person: mockPeople[1] } })
            })

            it('should call component service correct number of times', function () {
              expect(componentService.getComponent.callCount).to.equal(2)
            })

            it('should call component service correctly', function () {
              expect(
                componentService.getComponent.firstCall
              ).to.be.calledWithExactly('appCard', {
                profile: { person: mockPeople[0] },
              })
              expect(
                componentService.getComponent.secondCall
              ).to.be.calledWithExactly('appCard', {
                profile: { person: mockPeople[1] },
              })
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('with one result', function () {
            const mockPeople = [
              {
                id: 1,
                name: 'foo',
              },
            ]

            beforeEach(function () {
              req.people = mockPeople
              controller.setPeopleItems(req, {}, nextSpy)
            })

            it('should set people items property with checked property', function () {
              expect(req.form.options.fields.people.items).to.deep.equal([
                {
                  value: 1,
                  checked: true,
                  html: 'appCard',
                },
              ])
            })

            it('should call presenter correct number of times', function () {
              expect(presenters.profileToCardComponent.callCount).to.equal(1)
            })

            it('should call presenter correctly', function () {
              expect(
                presenters.profileToCardComponent.firstCall
              ).to.be.calledWithExactly({ locationType, showTags: false })
              expect(
                profileToCardComponentStub.firstCall
              ).to.be.calledWithExactly({ profile: { person: mockPeople[0] } })
            })

            it('should call component service correct number of times', function () {
              expect(componentService.getComponent.callCount).to.equal(1)
            })

            it('should call component service correctly', function () {
              expect(
                componentService.getComponent.firstCall
              ).to.be.calledWithExactly('appCard', {
                profile: { person: mockPeople[0] },
              })
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('with no results', function () {
            beforeEach(function () {
              controller.setPeopleItems(req, {}, nextSpy)
            })

            it('should set people items property', function () {
              expect(req.form.options.fields.people.items).to.deep.equal([])
            })

            it('should not call presenter', function () {
              expect(presenters.profileToCardComponent).not.to.be.called
            })

            it('should not call component service', function () {
              expect(componentService.getComponent).not.to.be.called
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })
        })
      })
    })

    describe('#checkFilter()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          sessionModel: {
            toJSON: sinon.stub(),
          },
          query: {},
          path: 'url-path',
          baseUrl: 'http://base-url.com/',
        }
        res = {
          redirect: sinon.spy(),
        }
        nextSpy = sinon.spy()
      })

      context('when filters do not exist in query', function () {
        context('when filters exist in session', function () {
          beforeEach(function () {
            req.sessionModel.toJSON.returns({
              'filter.police_national_computer': '12345',
              'filter.prison_number': 'ABCDE',
            })
            controller.checkFilter(req, res, nextSpy)
          })

          it('should not redirect', function () {
            expect(res.redirect).to.be.calledOnceWithExactly(
              'http://base-url.com/url-path?filter[police_national_computer]=12345&filter[prison_number]=ABCDE'
            )
          })

          it('should call next', function () {
            expect(nextSpy).not.to.be.called
          })
        })

        context('when filters do not exist in session', function () {
          beforeEach(function () {
            req.sessionModel.toJSON.returns({})
            controller.checkFilter(req, res, nextSpy)
          })

          it('should not redirect', function () {
            expect(res.redirect).not.to.be.called
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when filters exist in query', function () {
        beforeEach(function () {
          req.query.filter = {}
        })

        context('when filters exist in session', function () {
          beforeEach(function () {
            req.sessionModel.toJSON.returns({
              'filter.police_national_computer': '12345',
              'filter.prison_number': 'ABCDE',
            })
            controller.checkFilter(req, res, nextSpy)
          })

          it('should not redirect', function () {
            expect(res.redirect).not.to.be.called
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when filters do not exist in session', function () {
          beforeEach(function () {
            req.sessionModel.toJSON.returns({})
            controller.checkFilter(req, res, nextSpy)
          })

          it('should not redirect', function () {
            expect(res.redirect).not.to.be.called
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(PersonController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setSearchLocals')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(PersonController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setSearchLocals middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setSearchLocals
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#setSearchLocals()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          query: {},
          people: [],
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      describe('result count', function () {
        context('with empty array', function () {
          beforeEach(function () {
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set count to zero', function () {
            expect(res.locals.resultCount).to.equal(0)
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with items in array', function () {
          beforeEach(function () {
            req.people = [1, 2, 3, 4]
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set count to array length', function () {
            expect(res.locals.resultCount).to.equal(4)
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      describe('search term', function () {
        context('with empty query', function () {
          beforeEach(function () {
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set search term to undefined', function () {
            expect(res.locals.searchTerm).to.be.undefined
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with empty filter', function () {
          beforeEach(function () {
            req.query.filter = {}
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set search term to undefined', function () {
            expect(res.locals.searchTerm).to.be.undefined
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with one filter', function () {
          beforeEach(function () {
            req.query.filter = {
              filter_one: '12345',
            }
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set search term to value of first key', function () {
            expect(res.locals.searchTerm).to.equal('12345')
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with multiple filters', function () {
          beforeEach(function () {
            req.query.filter = {
              filter_one: '12345',
              filter_two: '67890',
            }
            controller.setSearchLocals(req, res, nextSpy)
          })

          it('should set search term to value of first key', function () {
            expect(res.locals.searchTerm).to.equal('12345')
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#saveValues()', function () {
      let req, nextSpy
      const mockPerson = {
        id: '8fadb516-f10a-45b1-91b7-a256196829f9',
        name: 'Tom Jones',
      }

      beforeEach(function () {
        sinon.stub(PersonController.prototype, 'saveValues')
        req = {
          people: [],
          form: {
            values: {},
          },
        }
        nextSpy = sinon.spy()
      })

      context('when person exists', function () {
        beforeEach(function () {
          req.form.values.people = mockPerson.id
          req.people = [mockPerson]
          controller.saveValues(req, {}, nextSpy)
        })

        it('should set result to person value', function () {
          expect(req.form.values).to.have.property('person')
          expect(req.form.values.person).to.deep.equal(mockPerson)
        })

        it('should call parent', function () {
          expect(
            PersonController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('when person does not exist', function () {
        beforeEach(function () {
          req.form.values.people = mockPerson.id
          controller.saveValues(req, {}, nextSpy)
        })

        it('should set person to undefined', function () {
          expect(req.form.values).to.have.property('person')
          expect(req.form.values.person).to.be.undefined
        })

        it('should call parent', function () {
          expect(
            PersonController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })
    })
  })
})
