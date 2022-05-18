import {DocumentDefinition, FilterQuery} from 'mongoose';
import { omit } from 'lodash'
import UserModel, {UserDocument} from "../models/user.model";

interface IvalidatePassword {
    email: string;
    password: string
}


export async function createUser (data: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>) {
    try {
        const user = await UserModel.create(data)
        return omit(user.toJSON(), 'password')
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function validatePassword({email, password}: IvalidatePassword) {
    const user = await UserModel.findOne({email})
    if (!user) return false

    const isValid = await user.comparePassword(password)
    if (!isValid) return false

    return omit(user.toJSON(), 'password')
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return UserModel.findOne(query).lean()
}