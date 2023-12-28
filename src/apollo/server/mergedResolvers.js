import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as UserResolvers } from './resolvers/User/resolvers'
import { resolvers as MovieResolvers } from './resolvers/Movie/resolvers'

const _MergedResolvers = mergeResolvers([
  UserResolvers,
  MovieResolvers
])

export default _MergedResolvers