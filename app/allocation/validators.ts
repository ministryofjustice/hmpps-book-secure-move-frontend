export function destinationDiffers(value: string, otherFieldName: string){
  // @ts-ignore
  const otherValue = this.values[otherFieldName]
  return value !== otherValue
}
