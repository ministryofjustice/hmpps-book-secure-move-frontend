const UpdateBaseController = require('./base')

const { DateChangedReason } = require('./index')

const controller = new DateChangedReason({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Date changed reason controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    it('should only have the expected methods of its own', function () {
      const expectedMethods = ['process', 'saveValues']
      const actualMethods = Object.getOwnPropertyNames(ownProto).filter(prop =>
        expectedMethods.includes(prop)
      )

      expect(actualMethods).to.deep.equal(expectedMethods)
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

    it('should call base controllers saveMove', function () {
      expect(
        UpdateBaseController.prototype.saveMove
      ).to.be.calledOnceWithExactly(req, res, nextSpy)
    })

    it('should not invoke next itself', function () {
      expect(nextSpy).to.not.be.called
    })
  })
})
