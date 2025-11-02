import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Checking if database needs seeding...')

    // Check if data already exists
    const existingCompanies = await prisma.company.count()

    if (existingCompanies > 0) {
        console.log('⏭️  Database already seeded, skipping...')
        return
    }

    console.log('🌱 Starting database seed...')

    // Create companies
    console.log('Creating companies...')
    const techCorp = await prisma.company.create({
        data: {
            name: 'TechCorp',
            size: 'LARGE',
            type: 'PUBLIC',
            comments: 'Great benefits and work-life balance',
        },
    })

    const startupCo = await prisma.company.create({
        data: {
            name: 'StartupCo',
            size: 'SMALL',
            type: 'STARTUP',
            comments: 'Fast-paced environment',
        },
    })

    const megaCorp = await prisma.company.create({
        data: {
            name: 'MegaCorp',
            size: 'ENTERPRISE',
            type: 'PUBLIC',
        },
    })

    // Create contacts
    console.log('Creating contacts...')
    const contact1 = await prisma.contact.create({
        data: {
            name: 'John Doe',
            email: 'john@techcorp.com',
            title: 'Senior Engineering Manager',
            linkedinProfile: 'https://linkedin.com/in/johndoe',
            seniority: 'SENIOR',
            contactStatus: 'CONNECTED',
            companyId: techCorp.id,
        },
    })

    const contact2 = await prisma.contact.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@startupco.com',
            title: 'CTO',
            seniority: 'VP',
            contactStatus: 'REACHED_OUT',
            companyId: startupCo.id,
        },
    })

    // Create applications
    console.log('Creating applications...')
    const app1 = await prisma.application.create({
        data: {
            jobTitle: 'Senior Backend Engineer',
            linkedinUrl: 'https://linkedin.com/jobs/12345',
            priority: 'HIGH',
            status: 'APPLIED_WITH_REFERRAL',
            location: 'San Francisco, CA',
            remoteType: 'HYBRID',
            preference: 'STRONGLY_PREFER',
            salaryMin: 150000,
            salaryMax: 200000,
            appliedDate: new Date().toISOString(),
            companyId: techCorp.id,
        },
    })

    const app2 = await prisma.application.create({
        data: {
            jobTitle: 'Full Stack Engineer',
            priority: 'MEDIUM',
            status: 'NOT_STARTED',
            location: 'Remote',
            remoteType: 'REMOTE',
            preference: 'PREFER',
            salaryMin: 120000,
            salaryMax: 160000,
            companyId: startupCo.id,
        },
    })

    const app3 = await prisma.application.create({
        data: {
            jobTitle: 'Engineering Manager',
            priority: 'LOW',
            status: 'EARLY_STAGES',
            location: 'New York, NY',
            remoteType: 'ONSITE',
            preference: 'NEUTRAL',
            companyId: megaCorp.id,
        },
    })

    // Link contacts to applications
    console.log('Linking contacts to applications...')
    await prisma.applicationContact.create({
        data: {
            applicationId: app1.id,
            contactId: contact1.id,
            role: 'Referral',
        },
    })

    await prisma.applicationContact.create({
        data: {
            applicationId: app2.id,
            contactId: contact2.id,
            role: 'Hiring Manager',
        },
    })

    const stats = {
        companies: await prisma.company.count(),
        contacts: await prisma.contact.count(),
        applications: await prisma.application.count(),
    }

    console.log(`📊 Successfully seeded with:`)
    console.log(`   - Companies: ${stats.companies}`)
    console.log(`   - Contacts: ${stats.contacts}`)
    console.log(`   - Applications: ${stats.applications}`)
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:')
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })