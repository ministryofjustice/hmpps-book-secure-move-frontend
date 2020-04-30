const CreateMoveDetails = require('../create/move-details')

const UpdateBaseController = require('./base')
const MoveDetailsController = require('./move-details')

const MixinProto = CreateMoveDetails.prototype

const controller = new MoveDetailsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function() {
  describe('Update move details controller', function() {
    it('should extend UpdateBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function() {
      it('should copy configure from CreateMoveDetails', function() {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy middlewareSetup from CreateMoveDetails', function() {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should copy setLocationItems from CreateMoveDetails', function() {
        expect(controller.setLocationItems).to.exist.and.equal(
          MixinProto.setLocationItems
        )
      })

      it('should copy setLocationItems from CreateMoveDetails', function() {
        expect(controller.setMoveTypes).to.exist.and.equal(
          MixinProto.setMoveTypes
        )
      })

      it('should copy process from CreateMoveDetails', function() {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should copy successHandler from CreateMoveDetails', function() {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function() {
        const ownMethods = ['getUpdateValues', 'saveValues']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#getUpdateValues', function() {
      let req = {}
      const res = {}
      beforeEach(function() {
        req = {
          getMove: sinon.stub(),
        }
      })

      context('When no move exists', function() {
        it('should return an empty object', function() {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a move type', function() {
        const move = { id: '#moveWithoutType' }
        beforeEach(function() {
          req.getMove.returns(move)
        })
        it('should return an empty object', function() {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a location id', function() {
        const move = { move_type: '#move_type' }
        beforeEach(function() {
          req.getMove.returns(move)
        })
        it('should return just the move type', function() {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
          })
        })
      })

      context('When a move exists with a location id', function() {
        const move = {
          move_type: '#move_type',
          to_location: {
            id: '#to_location_id',
          },
        }
        beforeEach(function() {
          req.getMove.returns(move)
        })
        it('should return the move type and to_location', function() {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
            'to_location_#move_type': '#to_location_id',
          })
        })
      })
    })

    describe('#saveValues', function() {
      const req = {}
      const res = {}
      let nextSpy
      beforeEach(async function() {
        sinon.stub(UpdateBaseController.prototype, 'saveMove')
        nextSpy = sinon.spy()
        await controller.saveValues(req, res, nextSpy)
      })

      it('should call base’s saveMove', async function() {
        expect(
          UpdateBaseController.prototype.saveMove
        ).to.be.calledOnceWithExactly(req, res, nextSpy)
      })

      it('should not invoke next itself', async function() {
        expect(nextSpy).to.not.be.called
      })
    })
  })
})
