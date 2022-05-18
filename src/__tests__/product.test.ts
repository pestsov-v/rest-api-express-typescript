import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import pino from 'pino'
import pretty from 'pino-pretty'
import { createProduct } from '../service/product.service'
import { signJwt } from '../utils/jwt.utils'

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

export const productPayload = {
	user: userId,
	title: 'Canon EoS 1500D DSLR Camera',
	description: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter level with the EOS 100D",
	price: 877.99,
	image: "https://i.imgur.com/QlRphfQ.jpg"
}

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

describe('product', () => {

  const logger = pino(pretty({ sync: true }));

beforeAll(async () => {
	const mongoServer = await MongoMemoryServer.create()
	await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongoose.connection.close()
})


	describe('get product route', () => {
		describe('given the product does not exist', () => {
			it('should return a 404', async () => {
				const productId = 'product-123'
				await supertest(app).get(`/api/products/${productId}`).expect(404)
			})
		})

		describe('given the product does exist', () => {
			it ('should return a 200 and the product', async () => {
				const product = await createProduct(productPayload)
				// @ts-ignore
				const productId = product.productId
				const {body, statusCode} = await supertest(app).get(`/api/products/${productId}`)

				expect(statusCode).toBe(200)
				expect(body.productId).toBe(productId)
			})
		})
	})

	describe('create product route', () => {
		describe('given the user is not logged in', () => {
			it('should return a 403', async () => {
				const {statusCode} = await supertest(app).post('/api/products')
				expect(statusCode).toBe(403)
			})
		})

		describe('given the user is logged in', () => {
			it('should return a 200 and create the product', async () => {
				const jwt = signJwt(userPayload)
				const {statusCode, body} = await supertest(app).post('/api/products').set('Authorization', `Bearer ${jwt}`).send(productPayload)
				expect(statusCode).toBe(200)
				expect(body).toEqual({
				"__v": 0,
				"_id": expect.any(String),
				"createdAt": expect.any(String),
				"description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter level with the EOS 100D",
				"image": "https://i.imgur.com/QlRphfQ.jpg",
				"price": 877.99,
				"productId": expect.any(String),
				"title": "Canon EoS 1500D DSLR Camera",
				"updatedAt": expect.any(String),
				"user": expect.any(String),
				})
			})
		})
	})
})