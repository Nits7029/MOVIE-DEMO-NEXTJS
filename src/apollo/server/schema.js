
import { makeExecutableSchema } from '@graphql-tools/schema'
import MergedResolvers from './mergedResolvers'
import MergedTypeDefs from './mergedTypeDefs'

export const schema = makeExecutableSchema({
  typeDefs: MergedTypeDefs,
  resolvers: MergedResolvers,
})