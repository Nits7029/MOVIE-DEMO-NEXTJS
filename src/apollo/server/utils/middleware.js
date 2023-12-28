import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'
import { AUTH_ERROR } from './errorMessages'
import models from '../models';

const { MIDDLEWARE_SECRET, TOKEN_EXPIRES_IN } = process.env

export const verifyAuthToken = async (req) => {
  try {
    let token = headers().get('authorization')
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }

      const decoded = await jwt.verify(token, MIDDLEWARE_SECRET);

      const user = await models.User.findOne({ _id: decoded?._id }).lean()
      return user
    }
  } catch (e) {
    throw new Error(e.message || AUTH_ERROR.UNKNOWN);
  }
};

export const generateToken = (payload) => {

  payload = payload || null;
  payload && payload.iat ? delete payload.iat : null;
  payload && payload.exp ? delete payload.exp : null;

  let token = payload ? jwt.sign(payload, MIDDLEWARE_SECRET, { algorithm: 'HS512', expiresIn: TOKEN_EXPIRES_IN }) : null;

  return token
};