import { Resolvers, ResolversTypes } from '../generated/graphql'
import { Context } from '../context'

export const applicationResolvers: Resolvers = {
    Query: {
        applications: async (_parent, args, context: Context) => {
            const { filter } = args
            const where: any = {}

            if (filter?.jobTitle) {
                where.jobTitle = { contains: filter.jobTitle, mode: 'insensitive' }
            }
            if (filter?.companyId) where.companyId = filter.companyId
            if (filter?.priority) where.priority = filter.priority
            if (filter?.status) where.status = filter.status
            if (filter?.location) {
                where.location = { contains: filter.location, mode: 'insensitive' }
            }
            if (filter?.remoteType) where.remoteType = filter.remoteType
            if (filter?.preference) where.preference = filter.preference

            return context.prisma.application.findMany({
                where,
                include: {
                    company: true,
                    contacts: {
                        include: {
                            contact: { include: { company: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            })
        },

        application: async (_parent, args, context: Context) => {
            return context.prisma.application.findUnique({
                where: { id: args.id },
                include: {
                    company: true,
                    contacts: {
                        include: {
                            contact: { include: { company: true } },
                        },
                    },
                },
            })
        },
    },

    Mutation: {
        createApplication: async (_parent, args, context: Context) => {
            const { input } = args
            return context.prisma.application.create({
                data: {
                    ...input,
                    postedDate: input.postedDate ? new Date(input.postedDate) : null,
                    postingEndDate: input.postingEndDate
                        ? new Date(input.postingEndDate)
                        : null,
                    appliedDate: input.appliedDate ? new Date(input.appliedDate) : null,
                    offerDeadline: input.offerDeadline
                        ? new Date(input.offerDeadline)
                        : null,
                },
                include: {
                    company: true,
                },
            })
        },

        updateApplication: async (_parent, args, context: Context) => {
            const { id, input } = args
            const data: Record<string, any> = { ...input }

            if ('postedDate' in input) {
                data.postedDate = input.postedDate ? new Date(input.postedDate) : null
            }
            if ('postingEndDate' in input) {
                data.postingEndDate = input.postingEndDate
                    ? new Date(input.postingEndDate)
                    : null
            }
            if ('appliedDate' in input) {
                data.appliedDate = input.appliedDate ? new Date(input.appliedDate) : null
            }
            if ('offerDeadline' in input) {
                data.offerDeadline = input.offerDeadline
                    ? new Date(input.offerDeadline)
                    : null
            }

            return context.prisma.application.update({
                where: { id },
                data,
                include: {
                    company: true,
                },
            })
        },

        deleteApplication: async (_parent, args, context: Context) => {
            return context.prisma.application.delete({
                where: { id: args.id },
            })
        },

        linkContactToApplication: async (_parent, args, context: Context) => {
            const { applicationId, contactId, role } = args

            const result = await context.prisma.applicationContact.create({
                data: {
                    applicationId,
                    contactId,
                    role,
                },
                include: {
                    contact: { include: { company: true } },
                    application: { include: { company: true } },
                },
            })

            return result as unknown as ResolversTypes['ApplicationContact']
        },

        unlinkContactFromApplication: async (_parent, args, context: Context) => {
            const { applicationContactId } = args

            const result = await context.prisma.applicationContact.delete({
                where: { id: applicationContactId },
                include: {
                    contact: { include: { company: true } },
                    application: { include: { company: true } },
                },
            })

            return result as unknown as ResolversTypes['ApplicationContact']
        },

        updateApplicationContact: async (
            _: any,
            { id, role }: { id: string; role?: string },
            context: Context
        ) => {
            const updated = context.prisma.applicationContact.update({
                where: { id },
                data: { role },
                include: {
                    contact: true,
                    application: true,
                },
            })
            return updated as unknown as ResolversTypes['ApplicationContact']
        },
    },

    Application: {
        contactLinks: async (parent, _args, context: Context) => {
            const result = await context.prisma.applicationContact.findMany({
                where: { applicationId: parent.id },
                include: {
                    contact: { include: { company: true } },
                },
                orderBy: { createdAt: 'desc' },
            });

            return result as unknown as ResolversTypes['ApplicationContact'][];
        },
    },
}