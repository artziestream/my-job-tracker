import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createContext } from './context.js'
import { resolvers } from './resolvers/index.js'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read the GraphQL schema
const typeDefs = readFileSync(
    join(__dirname, 'schema.graphql'),
    'utf-8'
)

// Create Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

// Start the server
async function startServer() {
    const { url } = await startStandaloneServer(server, {
        context: createContext,
        listen: { port: 4000 },
    })

    console.log(`🚀 Server ready at ${url}`)
    console.log(`📊 GraphQL Playground: ${url}`)
}

startServer().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
})