const CreateAssessment = require('../../../move/controllers/create/assessment')

const MixinProto = CreateAssessment.prototype
const AssessmentController = require('./assessment')
const AssignBaseController = require('./base')

const controller = new AssessmentController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function() {
  describe('Assign assessment controller', function() {
    it('should extend AssignBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function() {
      it('should copy configure from CreateAssessment', function() {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy setPreviousAssessment from CreateAssessment', function() {
        expect(controller.setPreviousAssessment).to.exist.and.equal(
          MixinProto.setPreviousAssessment
        )
      })

      it('should copy getAssessments from CreateAssessment', function() {
        expect(controller.getAssessments).to.exist.and.equal(
          MixinProto.getAssessments
        )
      })

      it('should copy saveValues from CreateAssessment', function() {
        expect(controller.saveValues).to.exist.and.equal(MixinProto.saveValues)
      })

      it('should only have the expected methods of its own', function() {
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
