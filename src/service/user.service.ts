import {DocumentDefinition, FilterQuery} from 'mongoose';
import { omit } from 'lodash'
import qs from 'querystring'
import UserModel, {UserDocument} from "../models/user.model";
import config from 'config'
import axios from 'axios'
import log from '../utils/logger'

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

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: config.get("googleClientId"),
    client_secret: config.get("googleClientSecret"),
    redirect_uri: config.get("googleOauthRedirectUrl"),
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(error.response.data.error);
    log.error(error, "Failed to fetch Google Oauth Tokens");
    throw new Error(error.message);
  }
}

export async function getGoogleUser({ id_token, access_token}) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {}
) {
  return UserModel.findOneAndUpdate(query, update, options);
}