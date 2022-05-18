import {object, number, string, TypeOf} from 'zod'

const payload = {
	body: object({
		title: string({required_error: 'Заголовок является обязательным полем'}),
		description: string({
			required_error: 'Описание является обязательным полем'
		}).min(120, "Описание должно иметь длину не менее 120 символов"),
		price: number({
			required_error: 'Цена является обязательным полем'
		}),
		image: string({
			required_error: 'Картинка является обязательным полем'
		})
	})
}

const params = {
	params: object({
		productId: string({
			required_error: 'АйДишник продукта является обязательным'
		})
	})
}

export const createProductSchema = object({
	...payload
})

export const getProductSchema = object({
	...params
})

export const updateProductSchema = object({
	...payload,
	...params
})

export const deleteProductSchema = object({
	...params
})

export type createProductInput = TypeOf<typeof createProductSchema>
export type readProductInput = TypeOf<typeof getProductSchema>
export type updateProductInput = TypeOf<typeof updateProductSchema>
export type deleteProductInput = TypeOf<typeof deleteProductSchema>