import { expect } from 'chai'
import sinon from 'sinon'

import { Location } from '../types/location'

import { findById } from './location'

describe('Location "service"', function () {
  describe('.findById', function () {
    let req: any
    let location: Location

    beforeEach(function () {
      req = {
        params: {},
        session: {},
        services: {
          referenceData: {
            getRegions: sinon.stub(),
            getLocationById: sinon.stub(),
          },
        },
      }
    })

    context('when getFromApi is false', function () {
      context(
        'when the id is in user locations and region locations',
        function () {
          beforeEach(async function () {
            req.session.user = {
              locations: [{ id: 'id', title: 'userLocations' }],
            }
            req.session.currentRegion = {
              locations: [{ id: 'id', title: 'regionLocations' }],
            }
            location = await findById(req, 'id', false)
          })

          it('returns the location from user locations', function () {
            expect(location).to.not.equal(undefined)
            expect(location.title).to.equal('userLocations')
          })
        }
      )

      context('when the id is in region locations', function () {
        beforeEach(async function () {
          req.session.currentRegion = {
            locations: [{ id: 'id', title: 'regionLocations' }],
          }
          location = await findById(req, 'id', false)
        })

        it('returns the location from region locations', function () {
          expect(location).to.not.equal(undefined)
          expect(location.title).to.equal('regionLocations')
        })
      })

      context(
        'when the id is not in user locations or region locations',
        function () {
          beforeEach(async function () {
            location = await findById(req, 'id', false)
          })

          it('returns null', function () {
            expect(location).to.equal(undefined)
          })
        }
      )

      afterEach(function () {
        expect(req.services.referenceData.getLocationById).to.not.have.been
          .called
      })
    })

    context('when getFromApi is true', function () {
      context(
        'when the id is in user locations and region locations',
        function () {
          beforeEach(async function () {
            req.session.user = {
              locations: [{ id: 'id', title: 'userLocations' }],
            }
            req.session.currentRegion = {
              locations: [{ id: 'id', title: 'regionLocations' }],
            }
            location = await findById(req, 'id', true)
          })

          it('returns the location from user locations', function () {
            expect(location).to.not.equal(undefined)
            expect(location.title).to.equal('userLocations')
          })

          it('does not call the api', function () {
            expect(req.services.referenceData.getLocationById).to.not.have.been
              .called
          })
        }
      )

      context('when the id is in region locations', function () {
        beforeEach(async function () {
          req.session.currentRegion = {
            locations: [{ id: 'id', title: 'regionLocations' }],
          }
          location = await findById(req, 'id', true)
        })

        it('returns the location from region locations', function () {
          expect(location).to.not.equal(undefined)
          expect(location.title).to.equal('regionLocations')
        })

        it('does not call the api', function () {
          expect(req.services.referenceData.getLocationById).to.not.have.been
            .called
        })
      })

      context(
        'when the id is not in user locations or region locations',
        function () {
          beforeEach(async function () {
            req.services.referenceData.getLocationById.resolves({
              id: 'id',
              title: 'apiLocations',
            })
            location = await findById(req, 'id', true)
          })

          it('returns null', function () {
            expect(
              req.services.referenceData.getLocationById
            ).to.have.been.calledOnceWithExactly('id')
            expect(location).to.not.equal(undefined)
            expect(location.title).to.equal('apiLocations')
          })
        }
      )
    })
  })
})
