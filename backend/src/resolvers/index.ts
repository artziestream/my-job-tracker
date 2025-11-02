import { Resolvers } from '../generated/graphql'
import { companyResolvers } from './company'
import { contactResolvers } from './contact'
import { applicationResolvers } from './application'

// Merge all resolvers into one
export const resolvers: Resolvers = {
    Query: {
        // Spread all Query resolvers from each file
        ...companyResolvers.Query,
        ...contactResolvers.Query,
        ...applicationResolvers.Query,
    },

    Mutation: {
        // Spread all Mutation resolvers from each file
        ...companyResolvers.Mutation,
        ...contactResolvers.Mutation,
        ...applicationResolvers.Mutation,
    },

    // Type resolvers (field resolvers)
    Company: companyResolvers.Company,
    Contact: contactResolvers.Contact,
    Application: applicationResolvers.Application,
}