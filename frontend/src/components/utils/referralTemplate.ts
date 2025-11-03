interface UserSettings {
    yourName: string
    yourCompany: string
    template: string
}

const DEFAULT_TEMPLATE = `Hi {contactName}, this is {yourName} from {yourCompany}. I saw a {jobTitle} posting open at {companyName} and I think I would be a good fit. Would you be able to give me a referral? {jobLink}`

const STORAGE_KEY = 'referralSettings'

// Load settings from localStorage
export const loadReferralSettings = (): UserSettings => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load referral settings:', e)
    }

    return {
        yourName: '',
        yourCompany: '',
        template: DEFAULT_TEMPLATE,
    }
}

// Save settings to localStorage
export const saveReferralSettings = (settings: UserSettings): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save referral settings:', e)
        throw e
    }
}

interface GenerateMessageParams {
    contactName: string
    jobTitle?: string
    companyName?: string
    jobLink?: string
}

// Generate referral message with replacements
export const generateReferralMessage = (
    params: GenerateMessageParams
): string => {
    const settings = loadReferralSettings()
    let message = settings.template

    // Replace all placeholders
    const replacements: Record<string, string> = {
        '{contactName}': params.contactName || '[Contact Name]',
        '{yourName}': settings.yourName || '[Your Name]',
        '{yourCompany}': settings.yourCompany || '[Your Company]',
        '{jobTitle}': params.jobTitle || '[Job Title]',
        '{companyName}': params.companyName || '[Company Name]',
        '{jobLink}': params.jobLink || '[No link available]',
    }

    Object.entries(replacements).forEach(([placeholder, value]) => {
        message = message.replace(new RegExp(placeholder, 'g'), value)
    })

    return message
}

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        throw new Error('Could not copy to clipboard')
    }
}