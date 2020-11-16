// FIXME - Below imports use fs which doesn't work in webpack
// import locationsToPopulationTableComponent from './locations-to-population-table-component'
// const locationsToPopulationTableComponent = require('./locations-to-population-table-component')

import macroTemplate from './dashboard.stories.njk'

export default {
  title: 'App Views/Population/Dashboard',
  component: macroTemplate,
}

const exampleLocation = {
  id: '54d1c8c3-699e-4198-9218-f923a7f18149',
  type: 'locations',
  key: 'wyi',
  title: 'WETHERBY (HMPYOI)',
  location_type: 'prison',
  meta: {
    populations: [
      {
        id: '1bf70844-6b85-4fa6-8437-1c3859f883ee',
        free_spaces: 2,
      },
      {
        id: '6318fafa-923d-468f-ab5f-dc9cbdd79198',
        free_spaces: -1,
      },
      {
        id: '06bb368a-d512-406c-9a3f-ef47d75a31c7',
        free_spaces: 0,
      },
      {
        id: '18a46696-f6ff-4c4e-8fe8-bc3177845a4a',
        free_spaces: undefined,
      },
      {
        id: 'abccd8db-29fe-47cf-b463-4f71cbea5416',
        free_spaces: undefined,
      },
    ],
  },
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: exampleLocation,
}
//
// export const inactive = Template.bind({})
// inactive.args = {
//   data: {
//     text: 'inactive',
//     classes: 'govuk-tag--inactive',
//   },
// }
//
// export const withLink = Template.bind({})
// withLink.args = {
//   data: {
//     text: 'alpha',
//     href: '/a-link',
//   },
// }
