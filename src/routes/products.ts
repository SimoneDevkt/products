/// <reference lib="dom" />

import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import S from 'fluent-json-schema'


const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const {httpErrors, roundedDiscount, getBase64FromUrl} = fastify;

  fastify.get('/products/raw/:id', {//get raw product
    schema: {
        params: S.object()
            .prop('id', S.number().required()),
        response: {
            200: S.object()
              .prop('status', S.string().required())
              .prop('data', S.object()
                .prop('id', S.number().required())
                .prop('title', S.string().required())
                .prop('description', S.string().required())
                .prop('price', S.number().required())
                .prop('discountPercentage', S.number().required())
                .prop('rating', S.number().required())
                .prop('stock', S.number().required())
                .prop('brand', S.string().required())
                .prop('category', S.string().required())
                .prop('thumbnail', S.string().required())
                .prop('images', S.array().items(S.string()).required())   
                .additionalProperties(false)           
              ).additionalProperties(false)
        }
    }
  }, async function (request: FastifyRequest<{Params: {id: string,};}>, reply) {
      try {        
        let prodRes = await fetch(`https://dummyjson.com/products/${request.params.id}`)
        if(prodRes.status !== 200){
          switch (prodRes.status) {
            case 404:
              return httpErrors.notFound("Product not found")
            default:
              throw `Error ${prodRes.status} not handled`
          }
        }
        let data = await prodRes.json()
        return {
          status: "OK",
          data
        };
      } catch (error) {        
        return httpErrors.serviceUnavailable('Service unavailable')
      }
  })

  fastify.get('/products/proc/:id', {//get processed product
    schema: {
        params: S.object()
            .prop('id', S.number().required()),
        response: {
            200: S.object()
              .prop('status', S.string().required())
              .prop('data', S.object()
                .prop('id', S.number().required())
                .prop('price', S.number().required())
                .prop('priceSell', S.number().required())
                .prop('totalStockValue', S.number().required())
                .prop('totalStockValueSell', S.number().required())      
                .additionalProperties(false)   
              ).additionalProperties(false)
        }
    }
  }, async function (request: FastifyRequest<{ Params: { id: string, }; }>, reply) {
    try {        
      let prodRes = await fetch(`https://dummyjson.com/products/${request.params.id}`)
      if(prodRes.status !== 200){
        switch (prodRes.status) {
          case 404:
            return httpErrors.notFound("Product not found")
          default:
            throw `Error ${prodRes.status} not handled`
        }
      }
      let jsonRes = await prodRes.json()

      let data = {
        id: jsonRes.id,
        price: jsonRes.price,
        priceSell: roundedDiscount(jsonRes.price, jsonRes.discountPercentage),
        totalStockValue: jsonRes.price * jsonRes.stock,
        totalStockValueSell: roundedDiscount(jsonRes.stock * jsonRes.price, jsonRes.discountPercentage)
      }
      return {
        status: "OK",
        data
      };
    } catch (error) {        
      return httpErrors.serviceUnavailable('Service unavailable')
    }
  })

  fastify.get('/products/download/:id', {//get base64 images of product
    schema: {
        params: S.object()
            .prop('id', S.number().required()),
        response: {
            200: S.object()
              .prop('status', S.string().required())
              .prop('data', S.object()
                .prop('images', S.array().items(S.string()).required())
                .additionalProperties(false)          
              ).additionalProperties(false)
        }
    }
  }, async function (request: FastifyRequest<{ Params: { id: string, }; }>, reply) {
    try {        
      let prodRes = await fetch(`https://dummyjson.com/products/${request.params.id}`)
      if(prodRes.status !== 200){
        switch (prodRes.status) {
          case 404:
            return httpErrors.notFound("Product not found")
          default:
            throw `Error ${prodRes.status} not handled`
        }
      }
      let jsonRes = await prodRes.json()
      let images: Array<string> = jsonRes.images
      
      let imagesBase64: Array<string> = []
      for (const img of images) {
        imagesBase64.push(await getBase64FromUrl(img))
      }
      
      return {
        status: "OK",
        data: {
          images: imagesBase64
        }
      };
    } catch (error) {        
      return httpErrors.serviceUnavailable('Service unavailable')
    }
  })
}

export default root;
