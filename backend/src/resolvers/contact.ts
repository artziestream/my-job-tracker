import { Resolvers, ResolversTypes } from '../generated/graphql'
import { Prisma } from '@prisma/client'

export const contactResolvers: Resolvers = {
    Query: {
        // Get all contacts with optional filtering
        contacts: async (_parent, args, context) => {
            const where: Prisma.ContactWhereInput = {}

            if (args.filter) {
                // Text searches (case-insensitive)
                if (args.filter.name) {
                    where.name = {
                        contains: args.filter.name,
                        mode: 'insensitive',
                    }
                }

                if (args.filter.email) {
                    where.email = {
                        contains: args.filter.email,
                        mode: 'insensitive',
                    }
                }

                if (args.filter.title) {
                    where.title = {
                        contains: args.filter.title,
                        mode: 'insensitive',
                    }
                }

                // Exact matches
                if (args.filter.seniority) {
                    where.seniority = args.filter.seniority
                }

                if (args.filter.contactStatus) {
                    where.contactStatus = args.filter.contactStatus
                }

                if (args.filter.companyId) {
                    where.companyId = args.filter.companyId
                }
            }

            return context.prisma.contact.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            })
        },

        contact: async (_parent, args, context) => {
            return context.prisma.contact.findUnique({
                where: { id: args.id },
            })
        },
    },

    Mutation: {
        createContact: async (_parent, args, context) => {
            return context.prisma.contact.create({
                data: {
                    ...args.input,
                    contactStatus: args.input.contactStatus || 'TO_REACH_OUT',
                },
            })
        },

        updateContact: async (_parent, args, context) => {
            return context.prisma.contact.update({
                where: { id: args.id },
                data: args.input,
            })
        },

        deleteContact: async (_parent, args, context) => {
            return context.prisma.contact.delete({
                where: { id: args.id },
            })
        },
    },

    Contact: {
        company: async (parent, _args, context) => {
            return context.prisma.company.findUniqueOrThrow({
                where: { id: parent.companyId },
            })
        },

        applicationLinks: async (parent, _args, context) => {
            const links = await context.prisma.applicationContact.findMany({
                where: { contactId: parent.id },
                include: {
                    application: { include: { company: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return links as unknown as ResolversTypes['ApplicationContact'][];
        },
    },
}