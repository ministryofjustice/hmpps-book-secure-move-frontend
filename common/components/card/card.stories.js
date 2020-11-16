import macroTemplate from './card.stories.njk'

export default {
  title: 'Components / Card',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const noParams = Template.bind({})

export const fullParams = Template.bind({})
fullParams.args = {
  data: {
    href: 'http://example.org',
    title: {
      text: 'Card with image',
    },
    image_path: 'http://placekitten.com/80/105',
    image_alt: 'Example alt text',
    caption: {
      text: 'Caption',
    },
    insetText: {
      label: 'Inset Text',
      text: 'Inset Text',
    },
    status: 'Status',
    meta: {
      items: [
        { label: 'Label 1', text: 'Text 1' },
        { label: 'Label 2', html: '<b>Text 2</b>' },
      ],
    },
    tags: {
      items: [
        { label: 'apptag', text: 'apptagtext 1' },
        { label: 'apptag 2', html: '<b>apptagtext</b>' },
        { label: 'apptag 2', html: 'app tag 3' },
        { label: 'apptag 2', html: 'app tag 3' },
      ],
    },
  },
}

// const stories = storiesOf('card', module)
//
// console.log(macroTemplate)
// stories
//   .add('with no params', () => `${macroTemplate()}`)
//   .add(
//     'with lots of params',
//     () =>
//       `${macroTemplate({
//         data: {
//           href: 'http://example.org',
//           title: {
//             text: 'Card with image',
//           },
//           image_path: 'https://via.placeholder.com/80x105.png',
//           image_alt: 'Example alt text',
//           caption: {
//             text: 'Caption',
//           },
//           insetText: {
//             label: 'Inset Text',
//             text: 'Inset Text',
//           },
//           status: 'Status',
//           meta: {
//             items: [
//               { label: 'Label 1', text: 'Text 1' },
//               { label: 'Label 2', html: '<b>Text 2</b>' },
//             ],
//           },
//           tags: {
//             items: [
//               { label: 'apptag', text: 'apptagtext 1' },
//               { label: 'apptag 2', html: '<b>apptagtext</b>' },
//               { label: 'apptag 2', html: 'app tag 3' },
//               { label: 'apptag 2', html: 'app tag 3' },
//             ],
//           },
//         },
//       })}`
//   )
