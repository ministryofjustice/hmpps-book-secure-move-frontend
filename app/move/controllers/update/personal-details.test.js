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

      it('should inherit saveValues from CreatePersonalDetails', function() {
        expect(controller.saveValues).to.exist.and.equal(MixinProto.saveValues)
      })

      it('should have no methods of its own', function() {
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal([])
      })
    })
  })
})
