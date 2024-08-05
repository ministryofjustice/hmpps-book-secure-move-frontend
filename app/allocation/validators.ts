export function destinationDiffers(value: string, otherFieldName: string){
  console.log(value, otherFieldName)
  // @ts-ignore
  const otherValue = this.values[otherFieldName]
  return value !== otherValue;
}
