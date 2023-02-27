import 'i18next'

declare module 'i18next' {
  // This is how we edit the config so that it's picked up by the TS compiler
  // eslint-disable-next-line no-unused-vars
  interface CustomTypeOptions {
    returnNull: false
  }
}
