import { combineResolvers } from "graphql-resolvers"
import models from "../../models"
import { CustomError } from "../../utils/customError"
import { GENERAL_ERROR, MOVIE_ERROR } from "../../utils/errorMessages"
import { isAuthenticated } from "../Common/resolvers"

export const resolvers = {
  Query: {
    getMovies: combineResolvers(isAuthenticated, (parent, args, { user }) => {
      return new Promise((resolve, reject) => {
        // const sort = { [args.sort.key]: args.sort.type };
        models.Movie.paginate({ isDeleted: false },
          {
            page: args.page,
            limit: args.limit,
            sort: { year: -1 },
            populate: "createdBy"
          },
        ).then((res) => {
          resolve({ count: res?.totalDocs || 0, data: res?.docs || [] });
        }).catch((err) => {
          reject(err);
        });
      })
    }),

    getMovie: combineResolvers(isAuthenticated, async (root, { id }, { user }) => {
      try {
        const movie = await models.Movie.findOne({ _id: id, isDeleted: false })
        if (!movie) {
          throw new CustomError(MOVIE_ERROR.NOT_FOUND, 400)
        }
        return userData
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    })
  },

  Mutation: {
    createMovie: combineResolvers(isAuthenticated, async (root, { input }, { user }) => {
      try {
        const movie = await models.Movie.findOne({ title: input?.title, isDeleted: false }).lean()
        if (movie) {
          throw new CustomError(MOVIE_ERROR.MOVIE_EXIST, 400)
        } else {
          let result = await models.Movie.create({
            ...input,
            createdBy: user._id,
          })

          return result

        }
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 400)
      }
    }),

    updateMovie: combineResolvers(isAuthenticated, async (root, { input }, { user }) => {
      try {
        const movie = await models.Movie.findOne({ _id: input?._id }).lean()
        if (!movie) {
          throw new CustomError(MOVIE_ERROR.NOT_FOUND, 400)
        }

        if (movie?.title !== input?.title) {
          const movieWithSameName = await models.Movie.findOne({
            _id: { $ne: movie?._id },
            title: input?.title,
            isDeleted: false
          }).lean().exec()

          if (movieWithSameName) {
            throw new CustomError(MOVIE_ERROR.MOVIE_EXIST, 400)
          }
        }

        delete input?._id
        const result = await models.Movie.findByIdAndUpdate(movie?._id, input, { new: true }).lean().exec()
        return result
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 400)
      }
    }),
  }
}