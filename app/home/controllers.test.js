const { home } = require('./controllers')

const res = {
  redirect: sinon.stub(),
}

describe('Home controllers', function() {
  describe('#home()', function() {
    it('should redirect to moves feature', function() {
      home({}, res)
      expect(res.redirect).to.have.been.calledOnceWithExactly('/moves')
    })
  })
})
