import macroTemplate from './internal-header.stories.njk'

export default {
  title: 'Internal Header',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})

export const withServiceName = Template.bind({})
withServiceName.args = {
  data: {
    serviceName: 'Service Name',
    serviceUrl: '/components/header',
  },
}

export const withNavigation = Template.bind({})
withNavigation.args = {
  data: {
    navigation: [
      {
        href: '#1',
        text: 'Navigation item 1',
        active: true,
      },
      {
        href: '#2',
        text: 'Navigation item 2',
      },
      {
        href: '#3',
        text: 'Navigation item 3',
      },
      { href: '#4', text: 'Navigation item 4' },
    ],
  },
}

export const nameWithServiceNameAndNavigation = Template.bind({})
nameWithServiceNameAndNavigation.args = {
  data: {
    serviceName: 'Service Name',
    serviceUrl: '/components/header',
    navigation: [
      { href: '#1', text: 'Navigation item 1', active: true },
      {
        href: '#2',
        text: 'Navigation item 2',
      },
      {
        href: '#3',
        text: 'Navigation item 3',
      },
      {
        href: '#4',
        text: 'Navigation item 4',
      },
    ],
  },
}

export const withLargeNavigation = Template.bind({})
withLargeNavigation.args = {
  data: {
    navigation: [
      {
        href: '/browse/benefits',
        text: 'Benefits',
      },
      {
        href: '/browse/births-deaths-marriages',
        text: 'Births, deaths, marriages and care',
      },
      {
        href: '/browse/business',
        text: 'Business and self-employed',
      },
      {
        href: '/browse/childcare-parenting',
        text: 'Childcare and parenting',
      },
      {
        href: '/browse/citizenship',
        text: 'Citizenship and living in the UK',
      },
      {
        href: '/browse/justice',
        text: 'Crime, justice and the law',
      },
      {
        href: '/browse/disabilities',
        text: 'Disabled people',
      },
      {
        href: '/browse/driving',
        text: 'Driving and transport',
      },
      {
        href: '/browse/education',
        text: 'Education and learning',
      },
      {
        href: '/browse/employing-people',
        text: 'Employing people',
      },
      {
        href: '/browse/environment-countryside',
        text: 'Environment and countryside',
      },
      {
        href: '/browse/housing-local-services',
        text: 'Housing and local services',
      },
      {
        href: '/browse/tax',
        text: 'Money and tax',
      },
      {
        href: '/browse/abroad',
        text: 'Passports, travel and living abroad',
      },
      {
        href: '/browse/visas-immigration',
        text: 'Visas and immigration',
      },
      {
        href: '/browse/working',
        text: 'Working, jobs and pensions',
      },
    ],
  },
}

export const fullWidth = Template.bind({})
fullWidth.args = {
  data: {
    containerClasses: 'govuk-header__container--full-width',
    navigationClasses: 'govuk-header__navigation--end',
    productName: 'Product Name',
  },
}

export const fullWidthWithNavigation = Template.bind({})
fullWidthWithNavigation.args = {
  data: {
    containerClasses: 'govuk-header__container--full-width',
    navigationClasses: 'govuk-header__navigation--end',
    productName: 'Product Name',
    navigation: [
      { href: '#1', text: 'Navigation item 1', active: true },
      {
        href: '#2',
        text: 'Navigation item 2',
      },
      {
        href: '#3',
        text: 'Navigation item 3',
      },
    ],
  },
}
