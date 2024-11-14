
export interface OrderBody {
  product_id: string
  title: string
  price: number
  qty: number
  product_option?: string
  color?: string
}


// export interface OrderResponse extends OrderBody {
//   id: string
//   collection_id: string
//   date: string
//   review?: string
//   status: "0" | "1" | "2" | "3" | "4" | "5"
//   status_datetime: string
//   color: string
// }

export interface Order {
  id: string,
  collection_id: string,
  title: string,
  price: number,
  qty: number,
  product_id: string,
  product_option: string,
  date: string,
  review: string,
  status: "0" | "1" | "2" | "3" | "4" | "5",
  status_datetime: string,
  color: string

}

export interface OrderResponse {
  collection_id: string,
  datetime: string,
  data: Order[]
}