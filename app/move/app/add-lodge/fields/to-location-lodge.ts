// @ts-ignore // TODO: convert to TS
import toLocation from '../../new/fields/common.to-location'

export const toLocationLodge = {
  ...toLocation,
  id: 'to_location_lodge',
  name: 'to_location_lodge',
  skip: false,
  validate: 'required',
  label: {
    text: 'fields::to_location_lodge.label',
    classes: 'govuk-label--s',
  },
}
