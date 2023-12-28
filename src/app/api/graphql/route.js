import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { connectDBHandler } from '@/apollo/server/lib/db'
import { schema } from '@/apollo/server/schema'
import { verifyAuthToken } from '@/apollo/server/utils/middleware'

export const maxDuration = 500;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'

const apolloServer = new ApolloServer({
  schema,
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')
      .replace('Context creation failed: ', '')
      .replace('Unexpected error value: ', '')

    return { ...error, message };
  },
  formatResponse: (response) => {
    return response;
  }
})

const handler = connectDBHandler(startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res, user: await verifyAuthToken(req) })
}));

export { handler as GET, handler as POST };