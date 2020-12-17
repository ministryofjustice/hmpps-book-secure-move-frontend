const proxyquire = require('proxyquire')

const getMoveUrls = sinon.stub().returns({
  view: '/moove/1234',
  foo: '/foo/1234/bar',
})

const getMoveUrl = proxyquire('./get-move-url', {
  './get-move-urls': getMoveUrls,
})

describe('Move helpers', function () {
  describe('#getMoveUrl', function () {
    let url
    beforeEach(function () {
      getMoveUrls.resetHistory()
    })

    describe('when called without an explicit view', function () {
      beforeEach(function () {
        url = getMoveUrl('1234')
      })

      it('should get all the urls for the move id', function () {
        expect(getMoveUrls).to.be.calledOnceWithExactly('1234', undefined)
      })

      it('should return the view url by default', function () {
        expect(url).to.equal('/moove/1234')
      })
    })

    describe('when called with an explicit view', function () {
      beforeEach(function () {
        url = getMoveUrl('1234', 'foo')
      })

      it('should return the url for the explicit view', function () {
        expect(url).to.equal('/foo/1234/bar')
      })
    })

    describe('when called with an explicit view that does not exist', function () {
      beforeEach(function () {
        url = getMoveUrl('1234', 'bar')
      })

      it('should return the url for the explicit view', function () {
        expect(url).to.be.undefined
      })
    })

    describe('when called with options', function () {
      beforeEach(function () {
        url = getMoveUrl('1234', 'foo', { a: true })
      })

      it('should get all the urls for the move id, passing any options through', function () {
        expect(getMoveUrls).to.be.calledOnceWithExactly('1234', { a: true })
      })
    })
  })
})
