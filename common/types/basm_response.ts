export interface BasmResponse extends Express.Response {
  locals: {
    [x: string]: any
    cancelUrl?: string
  }
  render: (path: string, locals?: any) => void
  redirect?: (path: string, locals?: any) => void
}
