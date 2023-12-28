import { combineResolvers } from "graphql-resolvers"
import { GraphQLError } from 'graphql'
import models from "../../models"
import { CustomError } from "../../utils/customError"
import { USER_ERROR } from "../../utils/errorMessages"
import { generateToken } from "../../utils/middleware"
import { isAuthenticated } from "../Common/resolvers"

export const resolvers = {
  Query: {
    getUser: combineResolvers(isAuthenticated, async (root, args, { user }) => {
      try {
        const userData = await models.User.findOne({ _id: user._id, isDeleted: false })

        return userData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    signIn: async (root, { input }, { }) => {
      const user = await models.User.findOne({ email: input?.email?.trim(), isDeleted: false })
      if (!user) {
        throw new CustomError(USER_ERROR.NOT_FOUND, 400)
      }
      const isValid = await user.validatePassword(input?.password);
      if (!isValid) {
        throw new CustomError(USER_ERROR.INVALID_PASSWORD, 400)
      } else if (!user?.isActive) {
        throw new CustomError(USER_ERROR.USER_ACCOUNT_INACTIVE, 401)
      } else {

        const token = generateToken({ _id: user?._id })

        return {
          token,
          user,
        };
      }
    },

  }
}