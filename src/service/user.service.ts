import {DocumentDefinition} from 'mongoose'
import UserModel, {UserDocument} from "../models/user.model";


export async function createUser (data: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>) {
    try {
        return await UserModel.create(data)
    } catch (e: any) {
        throw new Error(e)
    }
}