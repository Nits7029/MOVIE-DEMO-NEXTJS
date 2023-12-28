import { mergeTypeDefs } from '@graphql-tools/merge'
import { userGQLSchema } from './resolvers/User/type-defs'
import { movieGQLSchema } from './resolvers/Movie/type-defs'

const _MergedTypeDefs = mergeTypeDefs([
  userGQLSchema,
  movieGQLSchema
])

export default _MergedTypeDefs