import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/server";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const userInput = {
  email: "test@example.com",
  name: "Jane Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};


describe('user', () => {
	describe('user registration', () => {
		describe('given the user name and password are valid', () => {
			it('should return the user payload', async () => {
				//@ts-ignore
				const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockReturnValueOnce(userPayload)
				const {statusCode, body} = await supertest(app).post('/api/users').send(userInput)

				expect(statusCode).toBe(200)
				expect(body).toEqual(userPayload)
				expect(createUserServiceMock).toHaveBeenLastCalledWith(userInput)
			})
		})

		describe('given the passwords do not match', () => {
			it('should return a 400', async () => {
				//@ts-ignore
				const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockReturnValueOnce(userPayload)
				const {statusCode, body} = await supertest(app).post('/api/users').send({...userInput, passwordConfirmation: 'doesnotmatch'})

				expect(statusCode).toBe(400);
				expect(createUserServiceMock).not.toHaveBeenCalled();
			})
		})

		describe('given the user service throws', () => {
			it('should handle a 409 error', async () => {
				//@ts-ignore
				const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockRejectedValue('Пусто')
				const {statusCode} = await supertest(app).post('/api/users').send({...userInput, passwordConfirmation: 'doesnotmatch'})

				expect(statusCode).toBe(400);
				expect(createUserServiceMock).not.toHaveBeenCalled();
			})
		})
	})
})