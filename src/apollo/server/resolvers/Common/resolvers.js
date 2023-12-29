import { skip } from 'graphql-resolvers';
import { CustomError } from "../../utils/customError"
import { AUTH_ERROR } from "../../utils/errorMessages"

export const isAuthenticated = (parent, args, { user }) => user ? skip : new CustomError(AUTH_ERROR.UNAUTHORIZED, 401);