const CreatePersonSearch = require('../../new/controllers/person-search')

const MixinProto = CreatePersonSearch.prototype
const AssignBaseController = require('./base')
const PersonSearchController = require('./person-search')

const controller = new PersonSearchController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function () {
  describe('Assign person search controller', function () {
    it('should extend AssignBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy successHandler from CreatePersonSearch', function () {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should copy saveValues from CreatePersonSearch', function () {
        expect(controller.saveValues).to.exist.and.equal(MixinProto.saveValues)
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = []
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })
  })
})
