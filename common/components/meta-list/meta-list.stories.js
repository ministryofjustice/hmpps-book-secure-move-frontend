import macroTemplate from './meta-list.stories.njk'

export default {
  title: 'Meta List',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    items: [
      {
        key: {
          text: 'From',
        },
        value: {
          text: 'Home',
        },
      },
      {
        key: {
          text: 'To',
        },
        value: {
          text: 'Work',
        },
      },
    ],
  },
}

export const withAction = Template.bind({})
withAction.args = {
  data: {
    items: [
      {
        key: {
          text: 'From',
        },
        value: {
          text: 'Home',
        },
      },
      {
        key: {
          text: 'To',
        },
        value: {
          text: 'Work',
        },
        action: {
          html: 'Action text',
          href: '/action',
          classes: 'action-class',
          attributes: {
            foo: 'bar',
          },
        },
      },
    ],
  },
}
