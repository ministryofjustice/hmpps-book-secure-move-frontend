const { sortBy } = require('lodash')
const proxyquire = require('proxyquire').noCallThru()

const controllers = require('./controllers')

const mockUserLocations = [
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'D location',
  },
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'B location',
  },
  {
    id: 'd8e9cf86-55cd-4412-83b7-3562b7d1f8b6',
    title: 'A location',
  },
  {
    id: '10923762-bc17-4ea1-bae3-68ea709ee23e',
    title: 'C location',
  },
]
const mockSupplierLocations = [
  ...mockUserLocations,
  {
    id: '70923762-bc17-4ea1-bae3-4ef429f9081e',
    title: 'a location',
  },
]

describe('Locations controllers', function () {
  let req, res
  const mockReferenceData = {
    getRegions: sinon.fake.returns(Promise.resolve([])),
    getLocationsBySupplierId: sinon.stub().resolves(mockSupplierLocations),
  }
  const proxiedController = proxyquire('./controllers', {})
  let nextSpy

  describe('#locations', function () {
    beforeEach(function () {
      req = {
        session: {
          user: {
            permissions: [],
          },
        },
        userLocations: mockUserLocations,
        services: {
          referenceData: mockReferenceData,
        },
      }
      res = {
        render: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context(
      'when the user is assigned a `allocation:create` permission',
      function () {
        beforeEach(function () {
          req.session.user.permissions = ['allocation:create']
        })

        context('when the region API is available', function () {
          it('should retrieve all regions', async function () {
            mockReferenceData.getRegions = sinon.fake.returns(
              Promise.resolve([])
            )
            await proxiedController.locations(req, res, nextSpy)
            expect(res.render).to.be.calledOnce
          })
        })

        context('when the region API is *not* available', function () {
          it('should fail gracefully', async function () {
            req.services.referenceData.getRegions = sinon.fake.returns(
              Promise.reject(new Error())
            )
            await proxiedController.locations(req, res, nextSpy)
            expect(nextSpy).to.be.calledOnce
          })
        })
      }
    )

    context(
      'when the user is not assigned a `allocation:create` permission',
      function () {
        it('should render template', function () {
          controllers.locations(req, res)
          expect(res.render).to.be.calledOnce
        })

        it('should return locations sorted by title', function () {
          controllers.locations(req, res)
          const params = res.render.args[0][1]
          expect(params).to.have.property('locations')
          expect(params.locations).to.deep.equal(
            sortBy(mockUserLocations, 'title')
          )
        })
      }
    )

    context('when the user is a supplier', function () {
      beforeEach(async function () {
        mockReferenceData.getLocationsBySupplierId = sinon
          .stub()
          .resolves(mockSupplierLocations)
        req.session.user.supplierId = 'aussiemanandvan'
        await proxiedController.locations(req, res)
      })
      it('should fetch user locations', async function () {
        expect(
          mockReferenceData.getLocationsBySupplierId
        ).to.be.calledOnceWithExactly('aussiemanandvan')
      })
      it('should render template', function () {
        expect(res.render).to.be.calledOnce
      })

      it('should return locations sorted by title', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('locations')
        expect(params.locations).to.deep.equal(
          sortBy(mockSupplierLocations, 'title')
        )
      })

      it('should set the location on the user session', function () {
        expect(req.session.user.locations).to.deep.equal(mockSupplierLocations)
      })
    })
  })
})
