const { expect } = require('chai')

const CreateRecallInfo = require('../../new/controllers/recall-info')

const UpdateBaseController = require('./base')
const RecallInfoController = require('./recall-info')

const MixinProto = CreateRecallInfo.prototype

const controller = new RecallInfoController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update recall info controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy middlewareSetup from CreateRecallInfo', function () {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['saveValues']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )

        expect(ownProps).to.deep.equal(ownMethods)
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

      it('should save the recall_date field', function () {
        expect(controller.saveFields).to.eql(['recall_date'])
      })
    })
  })
})
