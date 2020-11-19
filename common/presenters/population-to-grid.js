function populationToGrid({ population } = {}) {
  if (population === undefined) {
    return {}
  }

  return {
    details: {
      free_spaces: population.free_spaces,
      updated_at: population.updated_at,
    },
    totalSpace: [
      {
        property: 'operational_capacity',
        value: population.operational_capacity,
      },
      { property: 'usable_capacity', value: population.usable_capacity },
    ],

    unavailableSpace: [
      { property: 'unlock', value: population.unlock },
      { property: 'bedwatch', value: population.bedwatch },
      { property: 'overnights_in', value: population.overnights_in },
    ],

    availableSpace: [
      { property: 'overnights_out', value: population.overnights_out },
      { property: 'out_of_area_courts', value: population.out_of_area_courts },
      { property: 'discharges', value: population.discharges },
    ],
  }
}

module.exports = populationToGrid
