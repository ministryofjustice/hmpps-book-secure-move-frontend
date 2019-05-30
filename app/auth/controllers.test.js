const controllers = require('./controllers')

describe('Authentication app', () => {
  describe('#get()', () => {
    let req, res, url

    beforeEach(async () => {
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

    it('redirects to the intended URL', () => {
      expect(res.redirect).to.be.calledWith(url)
    })

    it('unsets session.postAuthRedirect', () => {
      expect(req.session.postAuthRedirect).to.equal(null)
    })
  })
})
