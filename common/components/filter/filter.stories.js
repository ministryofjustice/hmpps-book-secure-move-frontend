import macroTemplate from './filter.stories.njk'

export default {
  title: 'Components / Filter',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    classes: 'app-filter-stacked',
    items: [
      {
        active: false,
        href: '/moves/proposed',
        label: 'Moves proposed',
        value: 4,
      },
      {
        active: true,
        href: '/moves/requested',
        label: 'Moves requested',
        value: 3,
      },
      {
        active: false,
        href: '/moves/rejected',
        label: 'Moves rejected',
        value: 5,
      },
    ],
  },
}

export const withClasses = Template.bind({})
withClasses.args = {
  data: {
    classes: 'app-filter-stacked',
    items: [
      {
        active: true,
        href: '/moves/proposed',
        label: 'Moves proposed',
        value: 4,
      },
    ],
  },
}

export const withoutValue = Template.bind({})
withoutValue.args = {
  data: {
    items: [
      {
        active: false,
        href: '/moves/proposed',
        label: 'Moves proposed',
      },
      {
        active: true,
        href: '/moves/requested',
        label: 'Moves requested',
      },
    ],
  },
}

export const withoutLabel = Template.bind({})
withoutLabel.args = {
  data: {
    items: [
      {
        active: false,
        href: '/moves/proposed',
        value: 1,
      },
      {
        active: true,
        href: '/moves/requested',
        value: 2,
      },
    ],
  },
}
