const controller = require('./confirmation')

describe('Allocation controllers', function () {
  describe('confirmation controller', function () {
    let mockReq, mockRes, params
    const mockAllocation = {
      id: '1',
    }

    beforeEach(function () {
      mockReq = {
        allocation: mockAllocation,
      }
      mockRes = {
        render: sinon.stub(),
      }

      controller(mockReq, mockRes)

      params = mockRes.render.args[0][1]
    })

    it('renders the confirmation template', function () {
      expect(mockRes.render).to.have.been.calledOnce
      expect(mockRes.render.args[0][0]).to.equal(
        'allocation/views/confirmation'
      )
    })

    it('should pass correct number of locals to template', function () {
      expect(Object.keys(mockRes.render.args[0][1])).to.have.length(1)
    })

    it('should contain an allocation param', function () {
      expect(params).to.have.property('allocation')
      expect(params.allocation).to.deep.equal(mockAllocation)
    })
  })
})
