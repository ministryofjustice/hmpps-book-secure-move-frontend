const proxyquire = require('proxyquire').noCallThru()

const mockConfig = {
  API: {
    VERSION: 7,
  },
  APP_BUILD_DATE: '2019-10-10',
  APP_BUILD_TAG: '5226',
  APP_BUILD_BRANCH: 'main',
  APP_GIT_SHA: 'gbe34155ae5edfade5107bd5629d0c159dc37d19',
  APP_VERSION: '1.0.0',
  APP_BUILD_NUMBER: '2026-11-23.123.gbe3415',
  APP_NAME: 'hmpps-book-secure-move-frontend',
  PRODUCT_ID: 'DPS003',
}

const controllers = proxyquire('./controllers', {
  '../../config': mockConfig,
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
          version_number: mockConfig.APP_VERSION,
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
          version_number: mockConfig.APP_VERSION,
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
        version_number: mockConfig.APP_VERSION,
        build_date: mockConfig.APP_BUILD_DATE,
        build_tag: mockConfig.APP_BUILD_TAG,
        commit_id: mockConfig.APP_GIT_SHA,
        branch: mockConfig.APP_BUILD_BRANCH,
      })
    })
  })

  describe('#health()', function () {
    let res

    beforeEach(function () {
      sinon.stub(process, 'uptime').returns(123.45)
      res = {
        setHeader: sinon.stub(),
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      }
    })

    it('should set cache control header', function () {
      controllers.health({}, res)
      expect(res.setHeader).to.be.calledOnceWithExactly(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
    })

    context('when all services are OK', function () {
      beforeEach(function () {
        res.dependencies = [
          { name: 'Foo', status: 'OK' },
          { name: 'redis', status: 'NOT RUNNING' },
        ]
        controllers.health({}, res)
      })

      it('should set 200 status code', function () {
        expect(res.status).to.be.calledOnceWithExactly(200)
      })

      it('should render JSON', function () {
        expect(res.json).to.be.calledOnceWithExactly({
          status: 'UP',
          components: {
            Foo: { status: 'UP', details: 'OK' },
            redis: { status: 'UP', details: 'NOT RUNNING' },
          },
          build: {
            buildNumber: mockConfig.APP_BUILD_NUMBER,
            gitRef: mockConfig.APP_GIT_SHA,
          },
          version: mockConfig.APP_BUILD_NUMBER,
          uptime: 123,
        })
      })
    })

    context('when any service is not OK', function () {
      beforeEach(function () {
        res.dependencies = [
          { name: 'Foo', status: 'OK' },
          { name: 'Bar', status: 'Service unavailable', error: 'Timed out' },
        ]
        controllers.health({}, res)
      })

      it('should set 500 status code', function () {
        expect(res.status).to.be.calledOnceWithExactly(500)
      })

      it('should return `DOWN` status with component details', function () {
        const body = res.json.args[0][0]
        expect(body.status).to.equal('DOWN')
        expect(body.components).to.deep.equal({
          Foo: { status: 'UP', details: 'OK' },
          Bar: { status: 'DOWN', details: 'Timed out' },
        })
      })
    })
  })

  describe('#info()', function () {
    let res

    beforeEach(function () {
      sinon.stub(process, 'uptime').returns(123.45)
      res = {
        setHeader: sinon.stub(),
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }
      controllers.info({}, res)
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
        git: {
          branch: mockConfig.APP_BUILD_BRANCH,
          commit: { id: mockConfig.APP_GIT_SHA },
        },
        build: {
          artifact: mockConfig.APP_NAME,
          name: mockConfig.APP_NAME,
          version: mockConfig.APP_BUILD_NUMBER,
        },
        productId: mockConfig.PRODUCT_ID,
        uptime: 123,
      })
    })
  })
})
