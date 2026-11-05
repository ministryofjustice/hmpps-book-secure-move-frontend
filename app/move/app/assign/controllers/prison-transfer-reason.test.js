const CreatePrisonTransferReason = require('../../new/controllers/prison-transfer-reason')

const MixinProto = CreatePrisonTransferReason.prototype
const AssignBaseController = require('./base')
const PrisonTransferReasonController = require('./prison-transfer-reason')

const controller = new PrisonTransferReasonController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function () {
  describe('Assign prison transfer reason controller', function () {
    it('should extend AssignBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy middlewareSetup from CreatePrisonTransferReason', function () {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should copy getPrisonTransferReason from CreatePrisonTransferReason', function () {
        expect(controller.getPrisonTransferReason).to.exist.and.equal(
          MixinProto.getPrisonTransferReason
        )
      })

      it('should copy setTransferReasonItems from CreatePrisonTransferReason', function () {
        expect(controller.setTransferReasonItems).to.exist.and.equal(
          MixinProto.setTransferReasonItems
        )
      })

      it('should copy process from CreatePrisonTransferReason', function () {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should not have any methods of its own', function () {
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal([])
      })
    })

    describe('When inheriting from AssignBaseController', function () {
      it('should use the assign setMove', function () {
        expect(controller.setMove).to.equal(
          AssignBaseController.prototype.setMove
        )
      })

      it('should use the assign checkNoProfileExists', function () {
        expect(controller.checkNoProfileExists).to.equal(
          AssignBaseController.prototype.checkNoProfileExists
        )
      })
    })
  })
})
