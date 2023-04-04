import { find, flatMapDeep } from 'lodash'

export async function findById(req: any, id: string, getFromApi: boolean) {
  // Find this location in the available locations of the current user
  const userLocations = req.session?.user?.locations
  let location = find(userLocations, { id })

  if (!location) {
    // Find this location in the currentRegion of the current user
    const userRegionLocations = req.session?.currentRegion?.locations
    location = find(userRegionLocations, { id })
  }

  if (!location) {
    if (getFromApi) {
      location = await req.services.referenceData.getLocationById(id)
    } else {
      // Find this location in the all regions
      const allRegions = await req.services.referenceData.getRegions()
      const flattenedRegions = flatMapDeep(
        allRegions,
        region => region.locations
      )
      location = find(flattenedRegions, { id })
    }
  }

  return location
}
