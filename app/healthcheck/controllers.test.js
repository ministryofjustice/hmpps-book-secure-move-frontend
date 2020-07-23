const proxyquire = require('proxyquire').noCallThru()

const mockConfig = {
  API: {
    VERSION: 7,
  },
  APP_BUILD_DATE: '2019-10-10',
  APP_BUILD_TAG: '5226',
  APP_BUILD_BRANCH: 'master',
  APP_GIT_SHA: 'gbe34155ae5edfade5107bd5629d0c159dc37d19',
}
const mockManifest = {
  version_number: '1.0.0',
}
const controllers = proxyquire('./controllers', {
  '../../config': mockConfig,
  '../../package.json': mockManifest,
})

describe('Healthcheck controllers', function () {
  describe('#get()', function () {
    let res

    beforeEach(function () {
      res = {
        setHeader: sinon.stub(),
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      }
    })

    it('should set cache control header', function () {
      controllers.get({}, res)
      expect(res.setHeader).to.be.calledOnceWithExactly(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
    })

    context('when all services are OK', function () {
      beforeEach(function () {
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

      it('should set 200 status code', function () {
        expect(res.status).to.be.calledOnceWithExactly(200)
      })

      it('should return `OK` status', function () {
        expect(res.json.args[0][0]).to.contain.property('status')
        expect(res.json.args[0][0].status).to.equal('OK')
      })

      it('should render JSON', function () {
        expect(res.json.args[0][0]).to.deep.equal({
          status: 'OK',
          api_version: 7,
          version_number: mockManifest.version,
          build_date: mockConfig.APP_BUILD_DATE,
          build_tag: mockConfig.APP_BUILD_TAG,
          commit_id: mockConfig.APP_GIT_SHA,
          branch: mockConfig.APP_BUILD_BRANCH,
          dependencies: res.dependencies,
        })
      })
    })

    context('when any service is not OK', function () {
      beforeEach(function () {
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

      it('should set 503 status code', function () {
        expect(res.status).to.be.calledOnceWithExactly(503)
      })

      it('should return `Service unavailable` status', function () {
        expect(res.json.args[0][0]).to.contain.property('status')
        expect(res.json.args[0][0].status).to.equal('Service unavailable')
      })

      it('should render JSON', function () {
        expect(res.json.args[0][0]).to.deep.equal({
          status: 'Service unavailable',
          api_version: 7,
          version_number: mockManifest.version,
          build_date: mockConfig.APP_BUILD_DATE,
          build_tag: mockConfig.APP_BUILD_TAG,
          commit_id: mockConfig.APP_GIT_SHA,
          branch: mockConfig.APP_BUILD_BRANCH,
          dependencies: res.dependencies,
        })
      })
    })
  })

  describe('#ping()', function () {
    let res

    beforeEach(function () {
      res = {
        setHeader: sinon.stub(),
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }
      controllers.ping({}, res)
    })

    it('should set cache control header', function () {
      expect(res.setHeader).to.be.calledOnceWithExactly(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
    })

    it('should set 200 status code', function () {
      expect(res.status).to.be.calledOnceWithExactly(200)
    })

    it('should render JSON', function () {
      expect(res.json).to.be.calledOnceWithExactly({
        api_version: 7,
        version_number: mockManifest.version,
        build_date: mockConfig.APP_BUILD_DATE,
        build_tag: mockConfig.APP_BUILD_TAG,
        commit_id: mockConfig.APP_GIT_SHA,
        branch: mockConfig.APP_BUILD_BRANCH,
      })
    })
  })
})
