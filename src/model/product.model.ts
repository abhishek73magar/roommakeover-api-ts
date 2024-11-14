import Knex from "db";
import { InfoQueryType, InfoResponse, MostOrderType, Product, ProductFromTitle, ProductPagination, QueryType, TitleResponse } from "types/productTypes";
import ThrowError from "utils/ThrowError";

const get = async(query: QueryType): Promise<Product[] | ProductPagination> => {
  try {
    let limit= 30;
    let page = 1;
    let offset = 0
    const values: number[] = []
    let q = `
      SELECT p.*, 
        (
          SELECT json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) as image
      FROM products p
      WHERE p.status='1'
      ORDER BY p.create_date ASC
    `
    if(query.page){
      if(query.limit) limit = parseInt(query.limit, 10)
      if(query.page) page = parseInt(query.page, 10)
      offset = (page * limit) - limit
      
      q += ` LIMIT ? OFFSET ?`
      values.push(limit, offset)
    }

    const { rows }: { rows: Product[] } = await Knex.raw(q, values)
    
    // if page number is came from query
    if(query.page) {
      const [{ count }] = await Knex("products").where({ status: "1" }).count()
      const totalpage = Math.ceil(+count/limit)
      return { total: totalpage, data: rows, page }
    }
    //  other wise return all
    return rows

  } catch (error) {
    return ThrowError(error)
  }
}

const info = async(query: InfoQueryType): Promise<InfoResponse> => {
  try {
    if(query.name === 'count'){
      const [{ count }] = await Knex('products').where({ status: "1" }).count("*")
      return { total: +count }
    } else if(query.name === 'title'){
      const queryBuilder = Knex('products')
        .where({ status: '1' })
        .select<TitleResponse[]>('title')
        .orderBy('create_date', 'asc')

      if(query.limit){
        const product = await queryBuilder.limit(parseInt(query.limit, 10))
        return product;
      }
      const product= await queryBuilder
      return product;
    }
    throw new Error("Query Status not found !!")
  } catch (error) {
    return ThrowError(error)
  }
}

const getByTitle = async(title: string): Promise<ProductFromTitle | null> => {
  try {
    if(!title || title == '') throw new Error("Required Title !!")
    title = title.replace(/-/g, ' ').toLowerCase()
    const query = `
        SELECT p.*, 
        (
          SELECT json_agg(json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          )) FROM product_images pi WHERE pi.product_id=p.pid
        ) as images,
        CASE
          WHEN (
            SELECT COUNT(*) FROM reviews r WHERE r.product_id=p.pid
          ) > 0
          THEN (
            SELECT 
            SUM(r.rating)::NUMERIC/COUNT(*)
            FROM reviews r WHERE r.product_id=p.pid
          ) ELSE NULL
          END as rating        
        FROM products p WHERE LOWER(p.title)=?
      `
      const { rows }: { rows: ProductFromTitle[] } = await Knex.raw(query, [title])
      if(rows.length > 0) return rows[0]
      return null;
  } catch (error) {
    return ThrowError(error)
  }
}

const getByCategory = async(name: string): Promise<Product[]> => {
  try {
    if(!name || name === '') throw new Error("Category name is required !!")
    name = name.replace(/-/g, ' ').toLowerCase()

    let query = `SELECT 
      p.*, 
      (
        SELECT json_build_object(
          'url', pi.url,
          'originalname', pi.originalname
        ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
      ) as image
      FROM categoryS as c 
      LEFT JOIN products as p ON c.id=p.category_id 
      WHERE LOWER(c.name) = ?`

      const { rows }: { rows: Product[] } = await Knex.raw(query, [name])
      return rows;
    
  } catch (error) {
    return ThrowError(error)
  }
}

const onsale = async(): Promise<Product[]> => {
  try {
    const query = `
        SELECT p.*, 
        (
          SELECT json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) as image       
        FROM products p WHERE status='1' AND on_sale='1'
      `
    const { rows }: { rows: Product[] } = await Knex.raw(query)
    return rows;

  } catch (error) {
    return ThrowError(error)
  }
}

const search = async(query: { q?: string }): Promise<Product[] | null> => {
  try {
      if(!query.q || query.q === '') return null;
    const title = query.q.replace(/-/g, ' ')
    const sql = `
      SELECT p.*, 
      (
        SELECT json_build_object(
          'url', pi.url,
          'originalname', pi.originalname
        ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
      ) as image       
      FROM products p WHERE p.status='1' AND LOWER(title) 
      LIKE LOWER('%${title}%')
      `
    const { rows }: { rows: Product[] } = await Knex.raw(sql)
    return rows;
  } catch (error) {
    return ThrowError(error)
  }
}

const topSelling = async(): Promise<Product[]> => {
  try {
    const orderSql = `
      SELECT product_id, SUM(qty) as qty FROM orders WHERE NOT status = '0'
      GROUP BY product_id
      ORDER BY qty DESC
      LIMIT 7  
    `

    const { rows }: { rows: MostOrderType[] } = await Knex.raw(orderSql) // find most order product

    const productSql = `
       SELECT p.*, 
      ( 
        SELECT json_build_object(
          'url', pi.url,
          'originalname', pi.originalname
        ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
      ) as image       
      FROM products p WHERE pid IN (${rows.map(() => '?').join(',')}) AND status='1'
    `
    const { rows: product }: { rows: Product[] } = await Knex.raw(productSql, rows.map(i => i.product_id))
    return product
  } catch (error) {
    return ThrowError(error)
  }
}


export { get, info, getByTitle, getByCategory, onsale, search, topSelling }