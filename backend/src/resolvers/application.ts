import { Resolvers } from '../generated/graphql'
import { Prisma } from '@prisma/client'

export const applicationResolvers: Resolvers = {
    Query: {
        // Get all applications with optional filtering
        applications: async (_parent, args, context) => {
            const where: Prisma.ApplicationWhereInput = {}

            if (args.filter) {
                // Text searches
                if (args.filter.jobTitle) {
                    where.jobTitle = {
                        contains: args.filter.jobTitle,
                        mode: 'insensitive',
                    }
                }

                if (args.filter.location) {
                    where.location = {
                        contains: args.filter.location,
                        mode: 'insensitive',
                    }
                }

                // Exact matches
                if (args.filter.companyId) {
                    where.companyId = args.filter.companyId
                }

                if (args.filter.priority) {
                    where.priority = args.filter.priority
                }

                if (args.filter.status) {
                    where.status = args.filter.status
                }

                if (args.filter.remoteType) {
                    where.remoteType = args.filter.remoteType
                }

                if (args.filter.preference) {
                    where.preference = args.filter.preference
                }

                // Salary range filters
                if (args.filter.minSalary !== undefined) {
                    where.salaryMax = { gte: args.filter.minSalary }
                }

                if (args.filter.maxSalary !== undefined) {
                    where.salaryMin = { lte: args.filter.maxSalary }
                }
            }

            return context.prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            })
        },

        application: async (_parent, args, context) => {
            return context.prisma.application.findUnique({
                where: { id: args.id },
            })
        },
    },

    Mutation: {
        createApplication: async (_parent, args, context) => {
            return context.prisma.application.create({
                data: {
                    ...args.input,
                    priority: args.input.priority || 'MEDIUM',
                    status: args.input.status || 'NOT_STARTED',
                    preference: args.input.preference || 'NEUTRAL',
                },
            })
        },

        updateApplication: async (_parent, args, context) => {
            return context.prisma.application.update({
                where: { id: args.id },
                data: args.input,
            })
        },

        deleteApplication: async (_parent, args, context) => {
            return context.prisma.application.delete({
                where: { id: args.id },
            })
        },

        linkContactToApplication: async (_parent, args, context) => {
            await context.prisma.applicationContact.create({
                data: {
                    applicationId: args.applicationId,
                    contactId: args.contactId,
                    role: args.role,
                },
            })

            return context.prisma.application.findUniqueOrThrow({
                where: { id: args.applicationId },
            })
        },
    },

    Application: {
        company: async (parent, _args, context) => {
            return context.prisma.company.findUniqueOrThrow({
                where: { id: parent.companyId },
            })
        },

        contacts: async (parent, _args, context) => {
            const applicationContacts =
                await context.prisma.applicationContact.findMany({
                    where: { applicationId: parent.id },
                    include: { contact: true },
                })
            return applicationContacts.map((ac) => ac.contact)
        },
    },
}