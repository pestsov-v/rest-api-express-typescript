import {object, string, TypeOf} from "zod";

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Имя является обязательным полем'
        }),
        password: string({
            required_error: 'Пароль является обязательным полем'
        }).min(6, 'Пароль слишком короткий, минимальная длина пароля - 6 символов'),
        passwordConfirmation: string({
            required_error: 'Необходимо подтвердить пароль'
        }),
        email: string({
            required_error: 'Email является обязательным полем'
        }).email('Введенное значение не является почтой'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Пароли не совпадают',
        path: ['passwordConfirm']
    })
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirm'>;