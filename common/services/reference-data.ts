import { flattenDeep, sortBy } from 'lodash'

import restClient from '../lib/api-client/rest-client'
import { AllocationComplexCase } from '../types/allocation_complex_case'
import { AssessmentQuestion } from '../types/assessment_question'
import { BasmRequest } from '../types/basm_request'
import { Ethnicity } from '../types/ethnicity'
import { Gender } from '../types/gender'
import { Location } from '../types/location'
import { PrisonTransferReason } from '../types/prison_transfer_reason'
import { Region } from '../types/region'
import { Supplier } from '../types/supplier'

import { BaseService } from './base'

const locationInclude = ['suppliers']
const regionInclude = ['locations']

function sortLocations(locations: Location[]) {
  return sortBy(locations, ({ title = '' }) => title.toUpperCase())
}

export default class ReferenceDataService extends BaseService {
  async getGenders(): Promise<Gender[]> {
    return (await this.apiClient.findAll('gender')).data
  }

  async getEthnicities(): Promise<Ethnicity[]> {
    return (await this.apiClient.findAll('ethnicity')).data
  }

  async getAssessmentQuestions(
    category: string
  ): Promise<AssessmentQuestion[]> {
    return (
      await this.apiClient.findAll('assessment_question', {
        'filter[category]': category,
      })
    ).data
  }

  async getLocations({
    filter,
    combinedData,
    page = 1,
  }: {
    filter?: object
    combinedData?: Location[]
    page?: number
  } = {}): Promise<Location[]> {
    const { data, links } = await this.apiClient.findAll('location', {
      ...filter,
      page,
      per_page: 100,
      include: locationInclude,
    })
    const locations = combinedData ? flattenDeep([combinedData, ...data]) : data

    const hasNext = links.next && data.length !== 0

    if (!hasNext) {
      return sortLocations(locations)
    }

    return this.getLocations({
      filter,
      page: page + 1,
      combinedData: locations,
    })
  }

  async getLocationById(id: string): Promise<Location> {
    if (!id) {
      throw new Error('No location ID supplied')
    }

    return (
      await this.apiClient.find('location', id, { include: locationInclude })
    ).data
  }

  async getLocationByNomisAgencyId(nomisAgencyId: string): Promise<Location> {
    return (
      await this.getLocations({
        filter: {
          'filter[nomis_agency_id]': nomisAgencyId,
        },
      })
    )[0]
  }

  async getLocationsByNomisAgencyId(ids = []): Promise<Location[]> {
    return await this.mapLocationIdsToLocations(ids, id =>
      this.getLocationByNomisAgencyId(id)
    )
  }

  async getLocationsByType(types = []): Promise<Location[]> {
    return await this.getLocations({
      filter: {
        'filter[location_type]': types.length ? types.join(',') : undefined,
      },
    })
  }

  async getLocationsByTypeAndExtraditionCapable(
    types = []
  ): Promise<Location[]> {
    return await this.getLocations({
      filter: {
        'filter[location_type]': types.length ? types.join(',') : undefined,
        'filter[extradition_capable]': true,
      },
    })
  }

  async getLocationsBySupplierId(
    req: BasmRequest,
    supplierId: string
  ): Promise<Location[]> {
    const { data } = await restClient<'locations', Location>(
      req,
      `/suppliers/${supplierId}/locations`,
      {
        per_page: 2000,
      }
    )
    const locations = data.map(location => {
      const { attributes, relationships, ...values } = location
      return {
        ...values,
        ...attributes,
      }
    })

    return sortLocations(locations)
  }

  async getRegionById(id: string): Promise<Region> {
    if (!id) {
      throw new Error('No region ID supplied')
    }

    return (await this.apiClient.find('region', id, { include: regionInclude }))
      .data
  }

  async getRegions({
    page = 1,
    combinedData,
  }: { page?: number; combinedData?: Region[] } = {}): Promise<Region[]> {
    const { data, links } = await this.apiClient.findAll('region', {
      include: regionInclude,
      page,
      per_page: 100,
    })

    const regions = combinedData ? flattenDeep([combinedData, ...data]) : data

    const hasNext = links && links.next && data.length !== 0

    if (!hasNext) {
      return sortBy(regions, 'title')
    }

    return this.getRegions({
      page: page + 1,
      combinedData: regions,
    })
  }

  async mapLocationIdsToLocations(
    ids: string[],
    callback: (id: string) => Promise<Location>
  ): Promise<Location[]> {
    const locationPromises = ids.map(async id => {
      try {
        return await callback(id)
      } catch (e) {
        return false
      }
    })

    return sortLocations(
      (await Promise.all(locationPromises)).filter(l => l) as Location[]
    )
  }

  async getSuppliers(): Promise<Supplier[]> {
    return (await this.apiClient.findAll('supplier')).data
  }

  async getSupplierByKey(key: string): Promise<Supplier> {
    if (!key) {
      throw new Error('No supplier key provided')
    }

    return (await this.apiClient.find('supplier', key)).data
  }

  async getPrisonTransferReasons(): Promise<PrisonTransferReason[]> {
    return (await this.apiClient.findAll('prison_transfer_reason')).data
  }

  async getAllocationComplexCases(): Promise<AllocationComplexCase[]> {
    return (await this.apiClient.findAll('allocation_complex_case')).data
  }
}

module.exports = ReferenceDataService
