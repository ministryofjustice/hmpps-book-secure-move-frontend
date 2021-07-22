const CreateHospital = require('../../new/controllers/hospital')

const UpdateBaseController = require('./base')
const HospitalController = require('./hospital')

const MixinProto = CreateHospital.prototype

const controller = new HospitalController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update move details controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy configure from CreateHospital', function () {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy process from CreateMoveDetails', function () {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should copy successHandler from CreateMoveDetails', function () {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['getUpdateValues', 'saveValues']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )

        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#getUpdateValues', function () {
      let req = {}
      const res = {}
      const values = {}
      const mockMove = {}

      beforeEach(function () {
        req = {
          getMove: sinon.stub().returns(mockMove),
        }
      })

      context('When form has already been called', function () {
        it('should return values', function () {
          expect(controller.getUpdateValues(req, res, values)).to.equal(values)
        })
      })

      context('When form called for first time', function () {
        beforeEach(function () {
          req.initialStep = true
        })

        it('should return the move', function () {
          expect(controller.getUpdateValues(req, res, values)).to.equal(
            mockMove
          )
        })
      })
    })

    describe('#saveValues', function () {
      const req = {}
      const res = {}
      let nextSpy

      beforeEach(function () {
        sinon.stub(UpdateBaseController.prototype, 'saveMove')
        nextSpy = sinon.spy()
        controller.saveValues(req, res, nextSpy)
      })

      it('should call base’s saveMove', function () {
        expect(
          UpdateBaseController.prototype.saveMove
        ).to.be.calledOnceWithExactly(req, res, nextSpy)
      })

      it('should not invoke next itself', function () {
        expect(nextSpy).to.not.be.called
      })
    })
  })
})
