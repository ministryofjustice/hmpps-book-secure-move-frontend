export interface BasmResponse extends Express.Response {
  locals: {
    cancelUrl?: string
  }
}
