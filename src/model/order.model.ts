import Knex from "db"
import { Order, OrderBody, OrderResponse } from "types/orderTypes"
import { JWTPayload } from "types/userTypes"
import { uid } from "uid"
import ThrowError from "utils/ThrowError"


const create = async(body: OrderBody[], user: JWTPayload | undefined): Promise<string> => {
  const tnx = await Knex.transaction();
  try {
    if(!user) throw new Error("User not found !!")

    const collection_id = uid(10)
    const data = body.map(item => ({ ...item, collection_id, id: uid(10), user_id: user.id }))

    await tnx('orders').insert(data)
    await tnx('checkout').where({ user_id: user.id }).del()

    await tnx.commit()
    // send mail
    return "Order Send"
  } catch (error) {
    await tnx.rollback()
    return ThrowError(error)
  }
}

const get = async(user: JWTPayload | undefined): Promise<OrderResponse[]> => {
  try {
    if(!user) throw new Error("User Not found !!")
    const sql = `
      SELECT o.collection_id, o.datetime,
      array_agg(
        json_build_object(
          'id', id,
          'collection_id', collection_id,
          'title', title,
          'product_id', product_id,
          'price', price,
          'qty, qty,
          'product_option', product_option,
          'date', date,
          'review', review,
          'status', status,
          'status_datetime', status_datetime,
          'color', color,
          'image': SELECT json_build_object('url', url, 'originalname', originalname) FROM product_images WHERE product_id = o.product_id LIMIT 1
        )
      )
      WHERE user_id = ? 
      ORDER BY datetime DESC
      GROUP BY o.collection_id, o.datetime
    `
    const { rows } : { rows: OrderResponse[] } = await Knex.raw(sql, [user.id])
    return rows;

  } catch (error) {
    return ThrowError(error)
  }
}

const getByCollectionId = async(collection_id: string, user: JWTPayload | undefined): Promise<Order[]> => {
  try {
    if(!user) throw new Error("User not found !!")
    const sql = `
      SELECT o.*,
      (
        SELECT 
          json_build_object('url', url, 'originalname', originalname) 
        FROM product_images WHERE product_id = o.product_id LIMIT 1
      ) as image
      FROM orders o
      WHERE collection_id = ? AND user_id = ?
    `
    const { rows }: { rows: Order[] } = await Knex.raw(sql, [collection_id, user.id])

    return rows;
  } catch (error) {
    return ThrowError(error)
  }
}


export { create, get, getByCollectionId }