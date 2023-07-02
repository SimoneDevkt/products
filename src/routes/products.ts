/// <reference lib="dom" />

import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { productsDownload, productsProc, productsRaw } from '../schema/schema';

const products: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	const { httpErrors, roundedDiscount, getBase64FromUrl, config } = fastify;

	const url = config.PRODUCTS_API_URL

	fastify.get('/products/raw/:id', {//get raw product
		schema: productsRaw
	}, async function (request: FastifyRequest<{ Params: { id: string, }; }>, reply) {
		try {
			const prodRes: Response = await fetch(`${url}/products/${request.params.id}`)
			const { status } = prodRes
			if (status !== 200) {
				if (status === 404) {
					return httpErrors.notFound("Product not found")
				} else {
					throw new Error(`Error ${prodRes.status} not handled`)
				}
			}
			const data = await prodRes.json()
			return {
				status: 'OK',
				data
			};
		} catch (error) {
			return httpErrors.serviceUnavailable('Service unavailable')
		}
	})

	fastify.get('/products/proc/:id', {//get processed product
		schema: productsProc
	}, async function (request: FastifyRequest<{ Params: { id: string, }; }>, reply) {
		try {
			const prodRes: Response = await fetch(`${url}/products/${request.params.id}`)
			const { status } = prodRes
			if (status !== 200) {
				if (status === 404) {
					return httpErrors.notFound("Product not found")
				} else {
					throw new Error(`Error ${prodRes.status} not handled`)
				}
			}
			const jsonRes = await prodRes.json()
			const {id, price, discountPercentage, stock} = jsonRes

			const data = {
				id,
				price,
				priceSell: roundedDiscount(price, discountPercentage),
				totalStockValue: price * stock,
				totalStockValueSell: roundedDiscount(stock * price, discountPercentage)
			}
			return {
				status: 'OK',
				data
			};
		} catch (error) {
			return httpErrors.serviceUnavailable('Service unavailable')
		}
	})

	fastify.get('/products/download/:id', {//get base64 images of product
		schema: productsDownload
	}, async function (request: FastifyRequest<{ Params: { id: string, }; }>, reply) {
		try {
			const prodRes: Response = await fetch(`${url}/products/${request.params.id}`)
			const { status } = prodRes
			if (status !== 200) {
				if (status === 404) {
					return httpErrors.notFound("Product not found")
				} else {
					throw new Error(`Error ${prodRes.status} not handled`)
				}
			}
			const jsonRes = await prodRes.json()
			const { images } : { images: string[] } = jsonRes

			const imagesBase64: string[] = []
			for (const img of images) {
				imagesBase64.push(await getBase64FromUrl(img))
			}

			return {
				status: 'OK',
				data: {
					images: imagesBase64
				}
			};
		} catch (error) {
			return httpErrors.serviceUnavailable('Service unavailable')
		}
	})
}

export default products;
