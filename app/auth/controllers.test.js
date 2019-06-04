const controllers = require('./controllers')

describe('Authentication app', function () {
  describe('#get()', function () {
    let req, res, url

    beforeEach(async function () {
      url = '/test'
      req = {
        query: {},
        session: {
          postAuthRedirect: url,
        },
      }
      res = {
        redirect: sinon.spy(),
      }

      await controllers.get(req, res)
    })

    it('redirects to the intended URL', function () {
      expect(res.redirect).to.be.calledWith(url)
    })

    it('unsets session.postAuthRedirect', function () {
      expect(req.session.postAuthRedirect).to.equal(null)
    })
  })
})
