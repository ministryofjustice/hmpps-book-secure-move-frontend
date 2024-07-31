function destinationDiffers(value: string, otherFieldName: string){
  // @ts-ignore
  const otherValue = this.values[otherFieldName]
    console.log(value)
    console.log(otherValue)
  if (value === otherValue) {
    console.log('destination same as origin')
  }
  return true
}
