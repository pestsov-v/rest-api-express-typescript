import {object, string} from 'zod'

export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email является обязательным полем'
        }),
        password: string({
            required_error: 'Пароль является обязательным полем'
        })
    })
})