import macroTemplate from './request-filter.stories.njk'

export default {
  title: 'Components / Request Filter',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

// FIXME: `t is undefined` error
// const t = t => {
//   return t
// }

export const basic = Template.bind({})
basic.args = {
  data: {
    links: {
      editFilters: '/edit/filters',
      clearFilters: '/clear/filters',
    },
    categories: [
      {
        heading: {
          text: 'Filter by species',
        },
        items: [
          {
            href: '/monkey/remove',
            text: 'Monkey',
          },
          {
            href: '/dog/remove',
            text: 'Dog',
          },
        ],
      },
      {
        heading: {
          html: 'Filter by colour',
        },
        items: [
          {
            href: '/brown/remove',
            text: 'Brown',
          },
        ],
      },
    ],
  },
}
