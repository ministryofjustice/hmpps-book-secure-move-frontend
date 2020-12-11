const getMoveUrls = require('./get-move-urls')

describe('Move helpers', function () {
  describe('#getMoveUrls', function () {
    let urls

    describe('when just an id is required', function () {
      beforeEach(function () {
        urls = getMoveUrls('1234')
      })

      it('should set the url for the view', function () {
        expect(urls.view).to.equal('/move/1234')
      })

      it('should set the url for the timeline', function () {
        expect(urls.timeline).to.equal('/move/1234/timeline')
      })

      it('should set the url for the PER', function () {
        expect(urls['person-escort-record']).to.equal(
          '/move/1234/person-escort-record'
        )
      })

      it('should set the url for the YRA', function () {
        expect(urls['youth-risk-assessment']).to.equal(
          '/move/1234/youth-risk-assessment'
        )
      })

      it('should set the url for the assignment', function () {
        expect(urls.assign).to.equal('/move/1234/assign')
      })

      it('should set the url for the move confirmation', function () {
        expect(urls.confirmation).to.equal('/move/1234/confirmation')
      })
    })

    describe('when options are required', function () {
      it('should set the url for the timeline', function () {
        urls = getMoveUrls('1234', { entryPointUrl: '/foo' })
        expect(urls.update).to.equal('/move/1234/edit/foo')
      })

      describe('but not passed', function () {
        it('should return gibberish', function () {
          urls = getMoveUrls('1234')
          expect(urls.update).to.equal('/move/1234/editundefined')
        })
      })
    })
  })
})
