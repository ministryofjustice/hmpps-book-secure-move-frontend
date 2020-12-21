const proxyquire = require('proxyquire')

const frameworkFlagsToTagList = sinon
  .stub()
  .returns({ content: 'framework flag tags' })
const presenters = {
  frameworkFlagsToTagList,
}

const getMoveUrl = sinon.stub().returns('move-url')

const getPerDetails = proxyquire('./get-per-details', {
  '../../presenters': presenters,
  './get-move-url': getMoveUrl,
})

const getMockMove = personEscortRecord => {
  return {
    id: 'moveId',
    profile: {
      person_escort_record: personEscortRecord,
    },
  }
}

describe('Move helpers', function () {
  const personEscortRecord = {
    status: 'not_started',
    flags: ['a', 'b'],
  }
  const move = getMockMove(personEscortRecord)

  describe('#getPerDetails', function () {
    let perDetails

    beforeEach(function () {
      frameworkFlagsToTagList.resetHistory()
      getMoveUrl.resetHistory()
    })

    context('when getting the PER details', function () {
      beforeEach(function () {
        perDetails = getPerDetails(move)
      })

      it('should get the move url', function () {
        expect(getMoveUrl).to.be.calledOnceWithExactly('moveId')
      })

      it('should get the framework flag tag list', function () {
        expect(frameworkFlagsToTagList).to.be.calledOnceWithExactly({
          flags: ['a', 'b'],
          hrefPrefix: 'move-url',
          includeLink: true,
        })
      })

      it('should return the PER details data', function () {
        perDetails // ?
        expect(perDetails).to.deep.equal({
          personEscortRecord,
          personEscortRecordIsCompleted: false,
          personEscortRecordTagList: { content: 'framework flag tags' },
        })
      })
    })

    context('when the PER is empty', function () {
      beforeEach(function () {
        const moveWithEmptyPER = getMockMove()
        perDetails = getPerDetails(moveWithEmptyPER)
      })

      it('should not show the PER as completed', function () {
        expect(perDetails.personEscortRecordIsCompleted).to.be.false
      })
    })

    context('when the PER status is not started', function () {
      beforeEach(function () {
        const moveWithNotStartedStatus = getMockMove({
          status: 'not_started',
        })
        perDetails = getPerDetails(moveWithNotStartedStatus)
      })

      it('should not show the PER as completed', function () {
        expect(perDetails.personEscortRecordIsCompleted).to.be.false
      })
    })

    context('when the PER status is in progress', function () {
      beforeEach(function () {
        const moveWithInProgressStatus = getMockMove({
          status: 'in_progress',
        })
        perDetails = getPerDetails(moveWithInProgressStatus)
      })

      it('should not show the PER as completed', function () {
        expect(perDetails.personEscortRecordIsCompleted).to.be.false
      })
    })

    context('when the PER status is anything else', function () {
      beforeEach(function () {
        const moveWithOtherStatus = getMockMove({
          status: 'other',
        })
        perDetails = getPerDetails(moveWithOtherStatus)
      })

      it('should show the PER as completed', function () {
        expect(perDetails.personEscortRecordIsCompleted).to.be.true
      })
    })

    context('when calling the method without a profile', function () {
      const moveWithoutProfile = {
        id: 'moveId',
      }

      beforeEach(function () {
        perDetails = getPerDetails(moveWithoutProfile)
      })

      it('should get the framework flag tag list with no items', function () {
        frameworkFlagsToTagList.firstCall.args // ?
        expect(frameworkFlagsToTagList).to.be.calledOnceWithExactly({
          flags: undefined,
          hrefPrefix: 'move-url',
          includeLink: true,
        })
      })
    })
  })
})
