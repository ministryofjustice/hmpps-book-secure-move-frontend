const { sortBy } = require('lodash')
const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const restClient = sinon.stub()

const ReferenceDataService = proxyquire('./reference-data', {
  '../lib/api-client/rest-client': restClient,
})
const referenceDataService = new ReferenceDataService({ apiClient })

const mockGenders = [
  {
    id: 'd335715f-c9d1-415c-a7c8-06e830158214',
    title: 'Female',
  },
  {
    id: '4d9e344e-1f89-4ca8-a95f-ac14df3f1a24',
    title: 'Male',
  },
]
const mockEthnicities = [
  {
    id: 'b95bfb7c-18cd-419d-8119-2dee1506726f',
    title: 'Asian or Asian British (Indian)',
  },
  {
    id: '35660b02-243f-4df2-9337-e3ec49b6d70d',
    title: 'Black (Caribbean)',
  },
]
const mockSuppliers = [
  {
    id: 'b95bfb7c-18cd-419d-8119-2dee1506726f',
    name: 'GEOAmey',
  },
  {
    id: '35660b02-243f-4df2-9337-e3ec49b6d70d',
    name: 'Serco',
  },
]
const mockAssessmentQuestions = [
  {
    id: '76bb7065-3c69-4b7c-a17b-ac5881d7837e',
    title: 'Violent',
  },
  {
    id: '76e00bf9-55f6-4ea5-b018-2c47d060caf5',
    title: 'Escape',
  },
]
const mockLocations = [
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'Barnstaple Crown Court',
  },
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'Axminster Crown Court',
  },
  {
    id: '5e5da09d-a1b3-46c2-9f62-87c458893c21',
    title: 'AYLESBURY (HMP)',
  },
  {
    id: 'a4817921-1091-4a02-8757-c491e476e364',
    title: 'BERWYN (HMP)',
  },
  {
    id: '48e9427a-8c9d-4c45-a015-a35df05b119b',
    title: 'ALTCOURSE (HMP)',
  },
  {
    id: '4f867e1d-e2bd-48ad-ad54-57a94dc38ee5',
    title: 'Blackpool Custody Suite',
  },
]
const mockRegions = [
  {
    id: 'regiona-222b-4522-9d65-4ef429f9081e',
    title: 'Region A',
  },
  {
    id: 'regionb-f750-4ac3-ac76-fb631445f974',
    title: 'Region B',
  },
]

const locationInclude = ['suppliers']
const regionInclude = ['locations']

describe('Reference Data Service', function () {
  describe('#getGenders()', function () {
    const mockResponse = {
      data: mockGenders,
    }
    let response

    beforeEach(async function () {
      sinon.stub(apiClient, 'findAll')
      apiClient.findAll.withArgs('gender').resolves(mockResponse)

      response = await referenceDataService.getGenders()
    })

    it('should call API client', function () {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('gender')
    })

    it('should correct number of results', function () {
      expect(response.length).to.deep.equal(mockGenders.length)
    })

    it('should return response data', function () {
      expect(response).to.equal(mockGenders)
    })
  })

  describe('#getEthnicities()', function () {
    const mockResponse = {
      data: mockEthnicities,
    }
    let response

    beforeEach(async function () {
      sinon.stub(apiClient, 'findAll')
      apiClient.findAll.withArgs('ethnicity').resolves(mockResponse)

      response = await referenceDataService.getEthnicities()
    })

    it('should call API client', function () {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('ethnicity')
    })

    it('should correct number of results', function () {
      expect(response.length).to.deep.equal(mockEthnicities.length)
    })

    it('should return response data', function () {
      expect(response).to.equal(mockEthnicities)
    })
  })

  describe('#getAssessmentQuestions()', function () {
    const mockResponse = {
      data: mockAssessmentQuestions,
    }
    let response

    beforeEach(function () {
      sinon.stub(apiClient, 'findAll')
    })

    context('with no category', function () {
      beforeEach(async function () {
        apiClient.findAll
          .withArgs('assessment_question', {
            'filter[category]': undefined,
          })
          .resolves(mockResponse)

        response = await referenceDataService.getAssessmentQuestions()
      })

      it('should call API client with undefined category', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly(
          'assessment_question',
          {
            'filter[category]': undefined,
          }
        )
      })

      it('should correct number of results', function () {
        expect(response.length).to.deep.equal(mockAssessmentQuestions.length)
      })

      it('should return response data', function () {
        expect(response).to.equal(mockAssessmentQuestions)
      })
    })

    context('with category', function () {
      const mockCategory = 'risk'

      beforeEach(async function () {
        apiClient.findAll
          .withArgs('assessment_question', {
            'filter[category]': mockCategory,
          })
          .resolves(mockResponse)

        response =
          await referenceDataService.getAssessmentQuestions(mockCategory)
      })

      it('should call API client with category', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly(
          'assessment_question',
          {
            'filter[category]': mockCategory,
          }
        )
      })

      it('should correct number of results', function () {
        expect(response.length).to.deep.equal(mockAssessmentQuestions.length)
      })

      it('should return response data', function () {
        expect(response).to.equal(mockAssessmentQuestions)
      })
    })
  })

  describe('#getLocations()', function () {
    const mockResponse = {
      data: mockLocations,
      links: {},
    }
    const mockMultiPageResponse = {
      data: mockLocations,
      links: {
        next: 'http://next-page.com',
      },
    }
    const mockEmptyPageResponse = {
      data: [],
      links: {
        next: 'http://next-page.com',
      },
    }
    const mockFilter = {
      filterOne: 'foo',
    }
    let locations

    beforeEach(function () {
      sinon.stub(apiClient, 'findAll')
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.findAll.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          locations = await referenceDataService.getLocations()
        })

        it('should call the API client once', function () {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'location',
            {
              page: 1,
              per_page: 100,
              include: locationInclude,
            }
          )
        })

        it('should return locations sorted by title', function () {
          expect(locations).to.deep.equal(
            sortBy(locations, location => location?.title?.toUpperCase())
          )
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          locations = await referenceDataService.getLocations({
            filter: mockFilter,
          })
        })

        it('should call the API client with filter', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'location',
            {
              ...mockFilter,
              page: 1,
              per_page: 100,
              include: locationInclude,
            }
          )
        })
      })
    })

    context('with multiple pages', function () {
      beforeEach(function () {
        apiClient.findAll
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          locations = await referenceDataService.getLocations()
        })

        it('should call the API client twice', function () {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'location',
            {
              page: 1,
              per_page: 100,
              include: locationInclude,
            }
          )
        })

        it('should call API client with second page on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'location',
            {
              page: 2,
              per_page: 100,
              include: locationInclude,
            }
          )
        })

        it('should return locations sorted by title', function () {
          expect(locations).to.deep.equal(
            sortBy([...mockLocations, ...mockLocations], location =>
              location?.title?.toUpperCase()
            )
          )
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          locations = await referenceDataService.getLocations({
            filter: mockFilter,
          })
        })

        it('should call API client with filter on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'location',
            {
              ...mockFilter,
              page: 1,
              per_page: 100,
              include: locationInclude,
            }
          )
        })

        it('should call API client with filter on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'location',
            {
              ...mockFilter,
              page: 2,
              per_page: 100,
              include: locationInclude,
            }
          )
        })
      })
    })

    context('with next but no data', function () {
      beforeEach(async function () {
        apiClient.findAll.resolves(mockEmptyPageResponse)
        locations = await referenceDataService.getLocations()
      })

      it('should call the API client once', function () {
        expect(apiClient.findAll).to.be.calledOnce
      })

      it('should return no moves', function () {
        expect(locations).to.deep.equal([])
      })
    })
  })

  describe('#getLocationById()', function () {
    context('without location ID', function () {
      it('should reject with error', function () {
        return expect(
          referenceDataService.getLocationById()
        ).to.be.rejectedWith('No location ID supplied')
      })
    })

    context('with location ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: mockLocations[0],
      }
      let location

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)

        location = await referenceDataService.getLocationById(mockId)
      })

      it('should call update method with data', function () {
        expect(apiClient.find).to.be.calledOnceWithExactly('location', mockId, {
          include: locationInclude,
        })
      })

      it('should return location', function () {
        expect(location).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#getLocationByNomisAgencyId()', function () {
    const mockResponse = mockLocations
    let locations

    beforeEach(function () {
      sinon.stub(referenceDataService, 'getLocations').resolves(mockResponse)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        locations = await referenceDataService.getLocationByNomisAgencyId()
      })

      it('should call getLocations methods', function () {
        expect(referenceDataService.getLocations).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locations).to.deep.equal(mockResponse[0])
      })

      describe('filters', function () {
        let filters

        beforeEach(function () {
          filters = referenceDataService.getLocations.args[0][0].filter
        })

        it('should set nomis_agency_id filter to undefined', function () {
          expect(filters).to.contain.property('filter[nomis_agency_id]')
          expect(filters['filter[nomis_agency_id]']).to.equal(undefined)
        })
      })
    })

    context('with arguments', function () {
      const mockAgencyId = 'PNT'

      beforeEach(async function () {
        locations =
          await referenceDataService.getLocationByNomisAgencyId(mockAgencyId)
      })

      it('should call et methods', function () {
        expect(referenceDataService.getLocations).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locations).to.deep.equal(mockResponse[0])
      })

      describe('filters', function () {
        let filters

        beforeEach(function () {
          filters = referenceDataService.getLocations.args[0][0].filter
        })

        it('should set nomis_agency_id filter to agency ID', function () {
          expect(filters).to.contain.property('filter[nomis_agency_id]')
          expect(filters['filter[nomis_agency_id]']).to.equal(mockAgencyId)
        })
      })
    })
  })

  describe('#getLocationsByNomisAgencyId()', function () {
    const mockAgencyIds = ['GCS', 'PNT', 'AFR']
    let locations

    beforeEach(function () {
      sinon.spy(referenceDataService, 'mapLocationIdsToLocations')
    })

    context('with list of IDs', function () {
      context('when locations are found', function () {
        beforeEach(async function () {
          sinon
            .stub(referenceDataService, 'getLocationByNomisAgencyId')
            .onFirstCall()
            .resolves({ key: 'GCS', title: 'Guildford Custody Suite' })
            .onSecondCall()
            .resolves({ key: 'PNT', title: 'GREATER MANCHESTER HMP' })
            .onThirdCall()
            .resolves({ key: 'AFR', title: 'Aylesbury Court' })

          locations =
            await referenceDataService.getLocationsByNomisAgencyId(
              mockAgencyIds
            )
        })

        it('should attempt to map each location', function () {
          expect(referenceDataService.mapLocationIdsToLocations).to.be
            .calledOnce
          expect(
            referenceDataService.getLocationByNomisAgencyId.callCount
          ).to.equal(mockAgencyIds.length)
        })

        it('should return an list of locations sorted by title', function () {
          expect(locations).to.deep.equal([
            { key: 'AFR', title: 'Aylesbury Court' },
            { key: 'PNT', title: 'GREATER MANCHESTER HMP' },
            { key: 'GCS', title: 'Guildford Custody Suite' },
          ])
        })
      })

      context('when locations are not found', function () {
        beforeEach(async function () {
          sinon
            .stub(referenceDataService, 'getLocationByNomisAgencyId')
            .rejects()

          locations =
            await referenceDataService.getLocationsByNomisAgencyId(
              mockAgencyIds
            )
        })

        it('should attempt to map each location', function () {
          expect(referenceDataService.mapLocationIdsToLocations).to.be
            .calledOnce
          expect(
            referenceDataService.getLocationByNomisAgencyId.callCount
          ).to.equal(mockAgencyIds.length)
        })

        it('should return an empty array', function () {
          expect(locations).to.be.an('array').that.is.empty
        })
      })
    })

    context('with empty list of IDs', function () {
      beforeEach(async function () {
        locations = await referenceDataService.getLocationsByNomisAgencyId()
      })

      it('should return an empty array', function () {
        expect(locations).to.be.an('array').that.is.empty
      })
    })
  })

  describe('#getLocationsByType()', function () {
    const mockResponse = mockLocations
    let locations

    beforeEach(function () {
      sinon.stub(referenceDataService, 'getLocations').resolves(mockResponse)
    })

    context('without type', function () {
      beforeEach(async function () {
        locations = await referenceDataService.getLocationsByType()
      })

      it('should call getMoves methods', function () {
        expect(referenceDataService.getLocations).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locations).to.deep.equal(mockResponse)
      })

      describe('filters', function () {
        let filters

        beforeEach(function () {
          filters = referenceDataService.getLocations.args[0][0].filter
        })

        it('should set location_type filter to undefined', function () {
          expect(filters).to.contain.property('filter[location_type]')
          expect(filters['filter[location_type]']).to.equal(undefined)
        })
      })
    })

    context('with a single type', function () {
      const mockType = 'court'

      beforeEach(async function () {
        locations = await referenceDataService.getLocationsByType([mockType])
      })

      it('should call getMoves methods', function () {
        expect(referenceDataService.getLocations).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locations).to.deep.equal(mockResponse)
      })

      describe('filters', function () {
        let filters

        beforeEach(function () {
          filters = referenceDataService.getLocations.args[0][0].filter
        })

        it('should set location_type filter to agency ID', function () {
          expect(filters).to.contain.property('filter[location_type]')
          expect(filters['filter[location_type]']).to.equal(mockType)
        })
      })
    })

    context('with multiple types', function () {
      const mockTypes = ['court', 'prison']

      beforeEach(async function () {
        locations = await referenceDataService.getLocationsByType(mockTypes)
      })

      it('should call getMoves methods', function () {
        expect(referenceDataService.getLocations).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locations).to.deep.equal(mockResponse)
      })

      describe('filters', function () {
        let filters

        beforeEach(function () {
          filters = referenceDataService.getLocations.args[0][0].filter
        })

        it('should set location_type filter to agency IDs separated by a comma', function () {
          expect(filters).to.contain.property('filter[location_type]')
          expect(filters['filter[location_type]']).to.equal('court,prison')
        })
      })
    })
  })

  describe('#getLocationsBySupplierId()', function () {
    const mockResponse = mockLocations
    let locations

    beforeEach(function () {
      restClient.resetHistory()
      restClient.resolves({ data: mockResponse })
    })

    context('with id', function () {
      const mockId = 'd335715f-c9d1-415c-a7c8-06e830158214'

      beforeEach(async function () {
        locations = await referenceDataService.getLocationsBySupplierId(
          {},
          mockId
        )
      })

      it('should call the supplier location endpoint', function () {
        expect(restClient).to.be.calledOnceWithExactly(
          {},
          '/suppliers/d335715f-c9d1-415c-a7c8-06e830158214/locations',
          {
            per_page: 2000,
          }
        )
      })

      it('should return locations sorted by title', function () {
        expect(locations).to.deep.equal(
          sortBy(mockResponse, location => location?.title?.toUpperCase())
        )
      })
    })
  })

  describe('#getSuppliers()', function () {
    const mockResponse = {
      data: mockSuppliers,
    }
    let response

    beforeEach(async function () {
      sinon.stub(apiClient, 'findAll')
      apiClient.findAll.withArgs('supplier').resolves(mockResponse)

      response = await referenceDataService.getSuppliers()
    })

    it('should call API client', function () {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('supplier')
    })

    it('should correct number of results', function () {
      expect(response.length).to.deep.equal(mockSuppliers.length)
    })

    it('should return response data', function () {
      expect(response).to.equal(mockSuppliers)
    })
  })

  describe('#getSupplierByKey()', function () {
    context('without supplier key', function () {
      it('should reject with error', function () {
        return expect(
          referenceDataService.getSupplierByKey()
        ).to.be.rejectedWith('No supplier key provided')
      })
    })

    context('with location key', function () {
      const mockKey = 'serco'
      const mockResponse = {
        data: mockSuppliers[0],
      }
      let response

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)

        response = await referenceDataService.getSupplierByKey(mockKey)
      })

      it('should call update method with data', function () {
        expect(apiClient.find).to.be.calledOnceWithExactly('supplier', mockKey)
      })

      it('should return supplier', function () {
        expect(response).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#getPrisonTransferReasons()', function () {
    const mockResponse = {
      data: ['item1', 'item2'],
    }

    let response
    let stubForFind

    beforeEach(async function () {
      stubForFind = sinon.stub(apiClient, 'findAll').resolves(mockResponse)

      response = await referenceDataService.getPrisonTransferReasons()
    })

    it('should request the list of reasons for transfer', function () {
      expect(stubForFind).to.be.calledOnceWithExactly('prison_transfer_reason')
    })

    it('should return response.data', function () {
      expect(response).to.deep.equal(mockResponse.data)
    })
  })

  describe('#getAllocationComplexCases', function () {
    const mockResponse = {
      data: ['item1', 'item2'],
    }

    let response
    let serviceStub

    beforeEach(async function () {
      serviceStub = sinon.stub(apiClient, 'findAll').resolves(mockResponse)

      response = await referenceDataService.getAllocationComplexCases()
    })

    it('should request the list of allocation complex cases', function () {
      expect(serviceStub).to.be.calledOnceWithExactly('allocation_complex_case')
    })

    it('should return response.data', function () {
      expect(response).to.deep.equal(mockResponse.data)
    })
  })

  describe('#getRegions()', function () {
    const mockResponse = {
      data: mockRegions,
      links: {},
    }
    const mockMultiPageResponse = {
      data: mockRegions,
      links: {
        next: 'http://next-page.com',
      },
    }
    const mockEmptyPageResponse = {
      data: [],
      links: {
        next: 'http://next-page.com',
      },
    }
    let regions

    beforeEach(function () {
      sinon.stub(apiClient, 'findAll')
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.findAll.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          regions = await referenceDataService.getRegions()
        })

        it('should call the API client once', function () {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'region',
            {
              page: 1,
              per_page: 100,
              include: regionInclude,
            }
          )
        })

        it('should return regions sorted by title', function () {
          expect(regions).to.deep.equal(sortBy(mockRegions, 'title'))
        })
      })
    })

    context('with multiple pages', function () {
      beforeEach(function () {
        apiClient.findAll
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          regions = await referenceDataService.getRegions()
        })

        it('should call the API client twice', function () {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'region',
            {
              page: 1,
              per_page: 100,
              include: regionInclude,
            }
          )
        })

        it('should call API client with second page on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'region',
            {
              page: 2,
              per_page: 100,
              include: regionInclude,
            }
          )
        })

        it('should return regions sorted by title', function () {
          expect(regions).to.deep.equal(
            sortBy([...mockRegions, ...mockRegions], 'title')
          )
        })
      })
    })

    context('with next but no data', function () {
      beforeEach(async function () {
        apiClient.findAll.resolves(mockEmptyPageResponse)
        regions = await referenceDataService.getRegions()
      })

      it('should call the API client once', function () {
        expect(apiClient.findAll).to.be.calledOnce
      })

      it('should return no regions', function () {
        expect(regions).to.deep.equal([])
      })
    })
  })

  describe('#getRegionById()', function () {
    context('without region ID', function () {
      it('should reject with error', function () {
        return expect(referenceDataService.getRegionById()).to.be.rejectedWith(
          'No region ID supplied'
        )
      })
    })

    context('with location ID', function () {
      const mockId = 'regiona-222b-4522-9d65-4ef429f9081e'
      const mockResponse = {
        data: mockRegions[0],
      }
      let region

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)

        region = await referenceDataService.getRegionById(mockId)
      })

      it('should call update method with data', function () {
        expect(apiClient.find).to.be.calledOnceWithExactly('region', mockId, {
          include: regionInclude,
        })
      })

      it('should return region', function () {
        expect(region).to.deep.equal(mockResponse.data)
      })
    })
  })
})
