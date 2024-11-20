export interface URLRequest {
  baseUrl: string
  path: string
  query: Record<string, any>
  params: Record<string, string | undefined>
}
