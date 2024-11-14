import Knex from "db"
import { CheckoutBody } from "types/checkoutTypes"
import { OrderResponse } from "types/orderTypes"
import { JWTPayload } from "types/userTypes"
import { uid } from "uid"
import ThrowError from "utils/ThrowError"

const create = async(body: CheckoutBody[], user: JWTPayload | undefined): Promise<OrderResponse[]> => {
  try {
    if(!user) throw new Error("User is not found !!")
    const bodyArr = body.map((item) => {
      return { ...item, id: uid(10), user_id: user.id }
    })
    const checkout: OrderResponse[] = await Knex('checkout').insert(bodyArr).returning('*')
    return checkout;
  } catch (error) {
    return ThrowError(error)
  }
}

const update = async(body: any) => {
        
}