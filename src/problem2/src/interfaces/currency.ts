export interface Currency extends Record<string, unknown> {
  id: number
  name: string
  symbol: string
  slug: string
  price: number
}
