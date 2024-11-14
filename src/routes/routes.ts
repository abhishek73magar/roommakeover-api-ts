import express, { Router } from 'express'
import * as user from 'controller/user.controller'
import * as product from 'controller/product.controller'
import * as order from 'controller/order.controller'

const router: Router = express.Router()

// for users 
router
  .post('/signup', user.signup)
  .post('/login', user.login)
  .post('/login-with-social', user.loginWithSocial)
  .patch('/user/bio', user.updateBio)
  .patch('/user', user.update)
  .get('/user', user.get)

// for products
router
  .get('/product', product.get)
  .get('/product/info', product.info)
  .get('/product/search', product.search)
  .get('/product/on-sale', product.onsale)
  .get('/product/top-selling', product.topSelling)
  .get('/product/:title', product.getByTitle)
  .get('/product/category/:name', product.getByCategory)

// for orders
router
  .post('/order', order.create)
  .get('/order', order.get)
  .get('/order/:collection_id', order.getByCollectionId)

// for checkout
router
  .post('/checkout')
  .patch('/checkout/:id')
  .get('/checkout')
  .delete('/checkout/:id')

export default router;