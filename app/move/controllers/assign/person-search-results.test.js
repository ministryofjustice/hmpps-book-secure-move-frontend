const CreatePersonSearchResults = require('../../app/new/controllers/person-search-results')

const MixinProto = CreatePersonSearchResults.prototype
const AssignBaseController = require('./base')
const PersonSearchResultsController = require('./person-search-results')

const controller = new PersonSearchResultsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function () {
  describe('Assign person search results controller', function () {
    it('should extend AssignBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy middlewareLocals from CreatePersonSearch', function () {
        expect(controller.middlewareLocals).to.exist.and.equal(
          MixinProto.middlewareLocals
        )
      })

      it('should copy setPeople from CreatePersonSearch', function () {
        expect(controller.setPeople).to.exist.and.equal(MixinProto.setPeople)
      })

      it('should copy setPeopleItems from CreatePersonSearch', function () {
        expect(controller.setPeopleItems).to.exist.and.equal(
          MixinProto.setPeopleItems
        )
      })

      it('should copy checkFilter from CreatePersonSearch', function () {
        expect(controller.checkFilter).to.exist.and.equal(
          MixinProto.checkFilter
        )
      })

      it('should copy setSearchLocals from CreatePersonSearch', function () {
        expect(controller.setSearchLocals).to.exist.and.equal(
          MixinProto.setSearchLocals
        )
      })

      it('should copy saveValues from CreatePersonSearch', function () {
        expect(controller.saveValues).to.exist.and.equal(MixinProto.saveValues)
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['middlewareSetup', 'middlewareChecks']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(AssignBaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')

        controller.middlewareSetup()
      })

      it('should call super method', function () {
        expect(AssignBaseController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call set people method', function () {
        expect(controller.use.firstCall).to.have.been.calledWithExactly(
          controller.setPeople
        )
      })

      it('should call set people items method', function () {
        expect(controller.use.secondCall).to.have.been.calledWithExactly(
          controller.setPeopleItems
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.have.been.calledTwice
      })
    })

    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(AssignBaseController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call super method', function () {
        expect(AssignBaseController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check filter method', function () {
        expect(controller.use.firstCall).to.have.been.calledWithExactly(
          controller.checkFilter
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })
  })
})
