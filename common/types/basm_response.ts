export interface BasmResponse extends Express.Response {
  locals: {
    cancelUrl?: string
  }
  render: (path: string, locals?: any) => void
}
