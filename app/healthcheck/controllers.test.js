const proxyquire = require('proxyquire').noCallThru()

const mockConfig = {
  BUILD_DATE: '2019-10-10',
  BUILD_BRANCH: 'master',
  GIT_SHA: 'gbe34155ae5edfade5107bd5629d0c159dc37d19',
}
const mockManifest = {
  version: '1.0.0',
}
const controllers = proxyquire('./controllers', {
  '../../config': mockConfig,
  '../../package.json': mockManifest,
})

describe('Healthcheck controllers', function() {
  describe('#get()', function() {
    let res

    beforeEach(function() {
      res = {
        setHeader: sinon.stub(),
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      }
    })

    it('should set cache control header', function() {
      controllers.get({}, res)
      expect(res.setHeader).to.be.calledOnceWithExactly(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
    })

    context('when all services are OK', function() {
      beforeEach(function() {
        res.dependencies = [
          {
            name: 'Foo',
            status: 'OK',
          },
          {
            name: 'Bar',
            status: 'OK',
          },
        ]
        controllers.get({}, res)
      })

      it('should set 200 status code', function() {
        expect(res.status).to.be.calledOnceWithExactly(200)
      })

      it('should return `OK` status', function() {
        expect(res.json.args[0][0]).to.contain.property('status')
        expect(res.json.args[0][0].status).to.equal('OK')
      })

      it('should render JSON', function() {
        expect(res.json.args[0][0]).to.deep.equal({
          status: 'OK',
          version: mockManifest.version,
          buildDate: mockConfig.BUILD_DATE,
          buildTag: mockConfig.BUILD_BRANCH,
          gitSha: mockConfig.GIT_SHA,
          dependencies: res.dependencies,
        })
      })
    })

    context('when any service is not OK', function() {
      beforeEach(function() {
        res.dependencies = [
          {
            name: 'Foo',
            status: 'OK',
          },
          {
            name: 'Bar',
            status: 'Service unavailable',
          },
        ]
        controllers.get({}, res)
      })

      it('should set 503 status code', function() {
        expect(res.status).to.be.calledOnceWithExactly(503)
      })

      it('should return `Service unavailable` status', function() {
        expect(res.json.args[0][0]).to.contain.property('status')
        expect(res.json.args[0][0].status).to.equal('Service unavailable')
      })

      it('should render JSON', function() {
        expect(res.json.args[0][0]).to.deep.equal({
          status: 'Service unavailable',
          version: mockManifest.version,
          buildDate: mockConfig.BUILD_DATE,
          buildTag: mockConfig.BUILD_BRANCH,
          gitSha: mockConfig.GIT_SHA,
          dependencies: res.dependencies,
        })
      })
    })
  })

  describe('#ping()', function() {
    let res

    beforeEach(function() {
      res = {
        setHeader: sinon.stub(),
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      }
      controllers.ping({}, res)
    })

    it('should set cache control header', function() {
      expect(res.setHeader).to.be.calledOnceWithExactly(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
    })

    it('should set 200 status code', function() {
      expect(res.status).to.be.calledOnceWithExactly(200)
    })

    it('should render JSON', function() {
      expect(res.send).to.be.calledOnceWithExactly('OK')
    })
  })
})
