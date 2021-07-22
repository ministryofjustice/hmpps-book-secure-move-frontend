const personService = {
  unformat: sinon.stub(),
  update: sinon.stub(),
}
const CreatePersonalDetails = require('../../new/controllers/personal-details')

const MixinProto = CreatePersonalDetails.prototype
const UpdateBaseController = require('./base')
const PersonalDetailsController = require('./personal-details')

const controller = new PersonalDetailsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update personal details controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    context('mixing in create controller', function () {
      it('should inherit configure from CreatePersonalDetails', function () {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should override saveValues', function () {
        expect(controller.saveValues).to.exist.and.equal(ownProto.saveValues)
      })

      it('should have no further methods of its own', function () {
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal([])
      })
    })

    describe('#saveValues', function () {
      let req
      const res = {}
      let nextSpy

      beforeEach(function () {
        sinon.stub(controller, 'setFlash')
        personService.unformat.returns({}).resetHistory()
        personService.update.resolves().resetHistory()
        req = {
          getPersonId: sinon.stub().returns('#personId'),
          getPerson: sinon.stub().returns({
            id: '#personId',
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
            person: personService,
          },
        }
        nextSpy = sinon.stub()
      })

      context('when the values have not changed', function () {
        beforeEach(async function () {
          personService.unformat.returns({ foo: 'a', bar: 'b' })
          await controller.saveValues(req, res, nextSpy)
        })

        it('should not call update', function () {
          expect(personService.update).to.not.be.called
        })

        it('should set the confirmation message', function () {
          expect(controller.setFlash).to.not.be.called
        })

        it('should invoke next with no error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when the values have changed', function () {
        beforeEach(async function () {
          await controller.saveValues(req, res, nextSpy)
        })

        it('should call unformat with expected field keys', function () {
          expect(personService.unformat).to.be.calledOnceWithExactly(
            {
              id: '#personId',
            },
            ['foo', 'bar'],
            { date: [] }
          )
        })

        it('should call update with expected data', function () {
          expect(personService.update).to.be.calledOnceWithExactly({
            id: '#personId',
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
          personService.update.rejects(error)
          await controller.saveValues(req, res, nextSpy)
        })

        it('should invoke next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(error)
        })
      })
    })
  })
})
