const controllers = require('./controllers')

describe('Authentication app', function () {
  describe('#get action', function () {
    let req, res, url

    beforeEach(async () => {
      url = '/test'
      req = {
        query: {},
        session: {
          postAuthRedirect: url,
        },
      }
      res = { redirect: sinon.spy() }

      await controllers.get(req, res)
    })

    it('redirects to the intended URL', function () {
      expect(res.redirect.calledWith(url)).to.be.true
    })
  })
})
