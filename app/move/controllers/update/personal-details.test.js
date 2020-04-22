const personService = require('../../../../common/services/person')
const CreatePersonalDetails = require('../create/personal-details')

const MixinProto = CreatePersonalDetails.prototype
const UpdateBaseController = require('./base')
const PersonalDetailsController = require('./personal-details')

const controller = new PersonalDetailsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function() {
  describe('Update personal details controller', function() {
    it('should extend UpdateBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    context('mixing in create controller', function() {
      it('should inherit configure from CreatePersonalDetails', function() {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should inherit savePerson from CreatePersonalDetails', function() {
        expect(controller.savePerson).to.exist.and.equal(MixinProto.savePerson)
      })

      it('should override saveValues', function() {
        expect(controller.saveValues).to.exist.and.equal(ownProto.saveValues)
      })

      it('should have no further methods of its own', function() {
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal([])
      })
    })

    describe('#saveValues', function() {
      let req
      const res = {}
      let nextSpy
      beforeEach(async function() {
        sinon.stub(CreatePersonalDetails.prototype, 'saveValues')
        sinon.stub(personService, 'update').resolves()
        sinon.stub(personService, 'unformat').returns({})
        req = {
          getPersonId: sinon.stub().returns('#personId'),
          getPerson: sinon.stub().returns({
            id: '#personId',
            identifiers: [
              {
                identifier_type: 'foo',
              },
            ],
          }),
          form: {
            values: {
              bar: 'baz',
            },
          },
        }
        nextSpy = sinon.spy()

        await controller.saveValues(req, res, nextSpy)
      })

      it('should call unformat with expected identifier fields', async function() {
        expect(personService.unformat).to.be.calledOnceWithExactly(
          {
            id: '#personId',
            identifiers: [
              {
                identifier_type: 'foo',
              },
            ],
          },
          ['foo']
        )
      })

      it('should yield to CreatePersonalDetails’s saveValue', async function() {
        expect(personService.update).to.not.be.called
        expect(
          CreatePersonalDetails.prototype.saveValues
        ).to.be.calledOnceWithExactly(req, res, nextSpy)
      })
    })
  })
})
