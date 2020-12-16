const proxyquire = require('proxyquire')

const moveToImportantEventsTagListComponent = sinon.stub()
const assessmentToTagList = sinon.stub()
const presenters = {
  moveToImportantEventsTagListComponent,
  assessmentToTagList,
}

const getMoveUrl = sinon.stub().returns('move-url')

const getTagLists = proxyquire('./get-tag-lists', {
  '../../presenters': presenters,
  './get-move-url': getMoveUrl,
})

describe('Move helpers', function () {
  const move = {
    id: 'moveId',
    profile: {
      assessment_answers: ['a', 'b'],
    },
  }

  describe('#getTagLists', function () {
    let tagLists

    beforeEach(function () {
      moveToImportantEventsTagListComponent.resetHistory()
      assessmentToTagList.resetHistory()
      getMoveUrl.resetHistory()
    })

    context('when calling the method', function () {
      beforeEach(function () {
        moveToImportantEventsTagListComponent.returns({
          content: 'important events tags',
        })
        assessmentToTagList.returns({ content: 'assessment tags' })
        tagLists = getTagLists(move)
      })

      it('should get the move url', function () {
        expect(getMoveUrl).to.be.calledOnceWithExactly('moveId')
      })

      it('should get the important event tag list', function () {
        expect(
          moveToImportantEventsTagListComponent
        ).to.be.calledOnceWithExactly(move)
      })

      it('should get the assessments tag list', function () {
        expect(assessmentToTagList).to.be.calledOnceWithExactly(
          move.profile.assessment_answers,
          'move-url'
        )
      })

      it('should return the tag lists data', function () {
        expect(tagLists).to.deep.equal({
          tagList: { content: 'assessment tags' },
          importantEventsTagList: { content: 'important events tags' },
        })
      })
    })

    context('when calling the method without a profile', function () {
      const moveWithoutProfile = {
        id: 'moveId',
      }

      beforeEach(function () {
        moveToImportantEventsTagListComponent.returns([])
        assessmentToTagList.returns([])
        tagLists = getTagLists(moveWithoutProfile)
      })

      it('should call the assesments tag list with no items', function () {
        expect(assessmentToTagList).to.be.calledOnceWithExactly([], 'move-url')
      })

      it('should return the tag lists data', function () {
        expect(tagLists).to.deep.equal({
          tagList: [],
          importantEventsTagList: [],
        })
      })
    })
  })
})
