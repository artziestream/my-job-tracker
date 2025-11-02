import { Resolvers } from '../generated/graphql'
import { Prisma } from '@prisma/client'

export const companyResolvers: Resolvers = {
    Query: {
        // Get all companies with optional filtering
        companies: async (_parent, args, context) => {
            const where: Prisma.CompanyWhereInput = {}

            if (args.filter) {
                // Text search (case-insensitive)
                if (args.filter.name) {
                    where.name = {
                        contains: args.filter.name,
                        mode: 'insensitive',
                    }
                }

                // Exact enum matches
                if (args.filter.size) {
                    where.size = args.filter.size
                }

                if (args.filter.type) {
                    where.type = args.filter.type
                }
            }

            return context.prisma.company.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            })
        },

        company: async (_parent, args, context) => {
            return context.prisma.company.findUnique({
                where: { id: args.id },
            })
        },
    },

    Mutation: {
        createCompany: async (_parent, args, context) => {
            return context.prisma.company.create({
                data: args.input,
            })
        },

        updateCompany: async (_parent, args, context) => {
            return context.prisma.company.update({
                where: { id: args.id },
                data: args.input,
            })
        },

        deleteCompany: async (_parent, args, context) => {
            return context.prisma.company.delete({
                where: { id: args.id },
            })
        },
    },

    Company: {
        contacts: async (parent, _args, context) => {
            return context.prisma.contact.findMany({
                where: { companyId: parent.id },
            })
        },

        applications: async (parent, _args, context) => {
            return context.prisma.application.findMany({
                where: { companyId: parent.id },
            })
        },
    },
}