export function config(id: string) {
  return {
    journeyName: `lodging-cancel-${id}`,
    name: `lodging-cancel-${id}`,
    template: '../../../../../form-wizard',
    templatePath: 'move/app/lodging/cancel/views/',
  }
}
