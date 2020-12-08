const controller = require('./assign-to-allocation')

describe('Allocation controllers', function () {
  describe('#assignToAllocation', function () {
    let mockReq
    let mockRes

    beforeEach(function () {
      mockReq = {
        allocation: {
          id: '__allocation_id__',
          moves: [],
        },
      }
      mockRes = {
        redirect: sinon.stub(),
      }
    })

    context('with moves to be assigned', function () {
      it('should redirect to next move to be assigned', function () {
        mockReq.allocation.moves = [
          {
            id: '_move_1',
            profile: {
              id: '_profile_1',
            },
          },
          {
            id: '_move_2',
          },
          {
            id: '_move_3',
          },
        ]
        controller(mockReq, mockRes)
        expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
          '/move/_move_2/assign'
        )
      })
    })

    context('when allocation is full', function () {
      it('should redirect back to allocation', function () {
        mockReq.allocation.moves = [
          {
            id: '_move_1',
            profile: {
              id: '_profile_1',
            },
          },
          {
            id: '_move_2',
            profile: {
              id: '_profile_2',
            },
          },
          {
            id: '_move_3',
            profile: {
              id: '_profile_3',
            },
          },
        ]
        controller(mockReq, mockRes)
        expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
          '/allocation/__allocation_id__'
        )
      })
    })
  })
})
