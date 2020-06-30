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

describe('Locations controllers', function () {
  let req, res
  const mockReferenceData = {}
  const proxiedController = proxyquire('./controllers', {
    '../../common/services/reference-data': mockReferenceData,
  })
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
            expect(req.session).to.have.property('regions')
            expect(req.session.regions).to.deep.equal([])
          })
        })

        context('when the region API is *not* available', function () {
          it('should fail gracefully', async function () {
            mockReferenceData.getRegions = sinon.fake.returns(
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
  })
})
