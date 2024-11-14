export type CheckoutBody = {
  product_id: string
  qty: number
  user_id: string
  product_option: string
  status: string
  color: string
}

export type CheckoutResponse = CheckoutBody & { id: string }