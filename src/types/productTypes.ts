
export type QueryType = {
  limit?: string
  page?: string
}

export type Image = {
  url: string
  originalname: string
}

export interface Product {
  id: string
  pid: string
  title: string
  price: number
  short_description: string
  more_info: string
  product_options: string
  create_date: string
  update_date: string
  on_sale: "0" | "1" // 0 = not on sale, 1 = on sale
  status: "0" | "1" | "2" // 0 = unpublished, 1 = published, 2 = draft
  quantity: number
  category_id: number
  is_discount: boolean
  new_price: number
  stock_status: "0" | "1" | "2" // 0 = out of stock, 1 = in stock, 2 = pre order
  image: Image | null | undefined
}

export interface ProductFromTitle extends Omit<Product, 'image'> {
  image: Image[] | null | undefined
  rating?: string | null
}

export type ProductPagination = {
  data: Product[]
  total: number
  page: number
}

export type InfoQueryType = {
  name?: string
  limit?: string
}

export type CountResponse = {
  total: number | string
}

export type TitleResponse = {
  title: string
}

export type InfoResponse = CountResponse | TitleResponse[]

export type MostOrderType = {
  product_id: string
  qty: string
}