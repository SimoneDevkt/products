import { test } from 'tap'
import { build } from '../helper'

test('200 /products/raw/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/raw/1'
  })

  t.match(JSON.parse(res.payload), { status: "OK", 
    data: {
      id: Number,
      title: String,
      description: String,
      price: Number,
      discountPercentage: Number,
      rating: Number,
      stock: Number,
      brand: String,
      category: String,
      thumbnail: String,
      images: [String]
    }
  }, 'check response format');
  t.equal(res.statusCode, 200, 'returns a status code of 200')
})
test('400 /products/raw/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/raw/sdf'
  })

  t.equal(res.statusCode, 400, 'returns a status code of 400')
})
test('404 /products/raw/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/raw/122'
  })

  t.equal(res.statusCode, 404, 'returns a status code of 404')
})

test('/products/proc/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/proc/1'
  })
  
  t.match(JSON.parse(res.payload), { 
    status: "OK",
    data: {
      id: Number,
      price: Number,
      priceSell: Number,
      totalStockValue: Number,
      totalStockValueSell: Number      
    }
  }, 'check response format');
  t.equal(res.statusCode, 200, 'returns a status code of 200')
})
test('400 /products/proc/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/proc/asdf'
  })

  t.equal(res.statusCode, 400, 'returns a status code of 400')
})
test('404 /products/proc/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/proc/122'
  })

  t.equal(res.statusCode, 404, 'returns a status code of 404')
})

test('/products/download/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/download/1'
  })

  t.match(JSON.parse(res.payload), {
      status: "OK",
      data: {
          images: [String]
      }
  }, 'check response format');
  t.equal(res.statusCode, 200, 'returns a status code of 200')
})
test('400 /products/download/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/download/sdf'
  })

  t.equal(res.statusCode, 400, 'returns a status code of 400')
})
test('404 /products/download/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/download/122'
  })

  t.equal(res.statusCode, 404, 'returns a status code of 404')
})