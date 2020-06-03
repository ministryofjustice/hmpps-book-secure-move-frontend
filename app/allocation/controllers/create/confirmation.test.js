const controller = require('./confirmation')

describe('Allocation controllers', function () {
  describe('confirmation controller', function () {
    let mockRes

    beforeEach(function () {
      mockRes = {
        render: sinon.stub(),
      }

      controller({}, mockRes)
    })

    it('renders the confirmation template', function () {
      expect(mockRes.render).to.have.been.calledOnceWithExactly(
        'allocation/views/confirmation'
      )
    })
  })
})
