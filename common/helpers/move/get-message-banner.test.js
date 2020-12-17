const proxyquire = require('proxyquire')

const moveToMessageBannerComponent = sinon.stub().returns({ content: 'banner' })
const presenters = {
  moveToMessageBannerComponent,
}

const getMoveUrl = sinon.stub().returns('move-url')

const getMessageBanner = proxyquire('./get-message-banner', {
  '../../presenters': presenters,
  './get-move-url': getMoveUrl,
})

describe('Move helpers', function () {
  const move = {
    id: 'moveId',
  }

  const canAccess = () => {}

  describe('#getMessageBanner', function () {
    let messageBanner

    beforeEach(function () {
      moveToMessageBannerComponent.resetHistory()
      getMoveUrl.resetHistory()
    })

    context('when calling the method', function () {
      beforeEach(function () {
        messageBanner = getMessageBanner(move, canAccess)
      })

      it('should get the move url', function () {
        expect(getMoveUrl).to.be.calledOnceWithExactly('moveId')
      })

      it('should get the message banner', function () {
        expect(moveToMessageBannerComponent).to.be.calledOnceWithExactly({
          move,
          moveUrl: 'move-url',
          canAccess,
        })
      })

      it('should return the message banner data', function () {
        expect(messageBanner).to.deep.equal({ content: 'banner' })
      })
    })
  })
})
