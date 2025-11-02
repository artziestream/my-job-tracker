import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: './src/schema.graphql',
    generates: {
        './src/generated/graphql.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useIndexSignature: true,
                contextType: '../context#Context',

                // Map to Prisma models properly
                mappers: {
                    Company: '@prisma/client#Company as PrismaCompany',
                    Contact: '@prisma/client#Contact as PrismaContact',
                    Application: '@prisma/client#Application as PrismaApplication',
                },

                maybeValue: 'T | null | undefined',
                inputMaybeValue: 'T | undefined',

                defaultMapper: 'Partial<{T}>',
                skipTypename: true,
                enumsAsTypes: true,
            },
        },
    },
}

export default config