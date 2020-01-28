const proxyquire = require('proxyquire')
const express = require('express')
const request = require('supertest')

const { setMoveDate } = require('./middleware')

describe('moves router', function() {
  const setMovesByDateAndLocationStub = sinon.stub().callsArg(2)
  const setMovesByDateAllLocationsStub = sinon.stub().callsArg(2)
  const downloadStub = sinon.stub().callsArg(2)
  const saveUrlStub = sinon.stub().callsArg(2)

  const protectRouteMiddlewareSpy = sinon.stub().callsArg(2)
  const protectRouteStub = sinon.stub().returns(protectRouteMiddlewareSpy)

  const setMoveDateStub = sinon.spy(setMoveDate)

  const { router, mountpath } = proxyquire('./index', {
    '../../common/middleware/permissions': {
      protectRoute: protectRouteStub,
    },
    './middleware': {
      setMovesByDateAndLocation: setMovesByDateAndLocationStub,
      setMovesByDateAllLocations: setMovesByDateAllLocationsStub,
      saveUrl: saveUrlStub,
      setMoveDate: setMoveDateStub,
    },
    './controllers': {
      download: downloadStub,
    },
  })

  var app = express()
  app.use(mountpath, router)

  context('user makes request with url /2020-01-28/download.csv', function() {
    before(async function() {
      await request(app).get('/moves/2020-10-01/download.csv')
    })

    it('should call protectRoute middleware', function() {
      expect(protectRouteMiddlewareSpy).to.be.calledOnce
    })

    it('should call the setMovesByDateAllLocations middleware', function() {
      expect(setMovesByDateAllLocationsStub).to.be.calledOnce
    })

    it('should call the setMoveDate parameter middleware', function() {
      expect(setMoveDateStub).to.be.calledOnce
    })

    it('should call the download controller', function() {
      expect(downloadStub).to.be.calledOnce
    })

    it('should not save the url', function() {
      expect(saveUrlStub).to.not.be.called
    })

    it('should not call the setMovesByDateAndLocation middleware', function() {
      expect(setMovesByDateAndLocationStub).to.not.be.called
    })
  })
})
