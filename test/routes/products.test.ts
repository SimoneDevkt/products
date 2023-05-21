import { test } from 'tap'
import { build } from '../helper'

test('/products/raw/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/raw/1'
  })

  // Verifica che il JSON abbia la struttura desiderata
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

test('/products/proc/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/proc/1'
  })

  // Verifica che il JSON abbia la struttura desiderata
  t.match(JSON.parse(res.payload), { status: "OK", 
    data: {
      status: "OK", 
      data: {
          id: Number,
          price: Number,
          priceSell: Number,
          totalStockValue: Number,
          totalStockValueSell: Number
      }
  }
  }, 'check response format');
  t.equal(res.statusCode, 200, 'returns a status code of 200')
})

test('/products/download/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/products/download/1'
  })

  // Verifica che il JSON abbia la struttura desiderata
  t.match(JSON.parse(res.payload), {
      status: "OK",
      data: {
          images: [String]
      }
  }, 'check response format');
  t.equal(res.statusCode, 200, 'returns a status code of 200')
})