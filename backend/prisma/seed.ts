import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Create Companies
    const techCorp = await prisma.company.upsert({
        where: { name: 'TechCorp' },
        update: {},
        create: {
            name: 'TechCorp',
            size: 'MEDIUM',
            type: 'STARTUP',
            rating: 4,
            comments: 'Fast-growing startup with great culture'
        }
    })
    console.log('✅ Created company:', techCorp.name)

    const bigTech = await prisma.company.upsert({
        where: { name: 'MegaCorp' },
        update: {},
        create: {
            name: 'MegaCorp',
            size: 'ENTERPRISE',
            type: 'PUBLIC',
            rating: 5,
            comments: 'Large tech company with excellent benefits'
        }
    })
    console.log('✅ Created company:', bigTech.name)

    // Create Contacts
    const contact1 = await prisma.contact.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@techcorp.com',
            title: 'Senior Engineering Manager',
            linkedinProfile: 'linkedin.com/in/johndoe',
            seniority: 'SENIOR',
            contactStatus: 'CONNECTED',
            companyId: techCorp.id,
            notes: 'Met at conference, very helpful'
        }
    })
    console.log('✅ Created contact:', contact1.name)

    const contact2 = await prisma.contact.create({
        data: {
            name: 'Jane Smith',
            email: 'jane.smith@megacorp.com',
            title: 'Technical Recruiter',
            linkedinProfile: 'linkedin.com/in/janesmith',
            seniority: 'MID',
            contactStatus: 'TO_REACH_OUT',
            companyId: bigTech.id
        }
    })
    console.log('✅ Created contact:', contact2.name)

    // Create Applications
    const app1 = await prisma.application.create({
        data: {
            jobTitle: 'Senior Software Engineer',
            linkedinUrl: 'linkedin.com/jobs/123',
            companyJobUrl: 'techcorp.com/careers/senior-swe',
            priority: 'HIGH',
            salaryMin: 150000,
            salaryMax: 200000,
            status: 'NOT_STARTED',
            location: 'San Francisco, CA',
            remoteType: 'HYBRID',
            preference: 'PREFER',
            postedDate: new Date('2024-10-15'),
            comments: 'Great opportunity, matches my skills',
            companyId: techCorp.id
        }
    })
    console.log('✅ Created application:', app1.jobTitle)

    const app2 = await prisma.application.create({
        data: {
            jobTitle: 'Staff Engineer',
            linkedinUrl: 'linkedin.com/jobs/456',
            priority: 'MEDIUM',
            salaryMin: 180000,
            salaryMax: 250000,
            status: 'APPLIED_WITH_REFERRAL',
            location: 'Remote',
            remoteType: 'REMOTE',
            preference: 'STRONGLY_PREFER',
            appliedDate: new Date('2024-10-20'),
            comments: 'Applied through John',
            companyId: bigTech.id
        }
    })
    console.log('✅ Created application:', app2.jobTitle)

    // Link Contacts to Applications
    await prisma.applicationContact.create({
        data: {
            applicationId: app1.id,
            contactId: contact1.id,
            role: 'Referral'
        }
    })
    console.log('✅ Linked contact to application')

    await prisma.applicationContact.create({
        data: {
            applicationId: app2.id,
            contactId: contact2.id,
            role: 'Recruiter'
        }
    })
    console.log('✅ Linked contact to application')

    console.log('🎉 Seed complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })