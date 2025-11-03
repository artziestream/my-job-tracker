export const sizeOptions = [
    { label: 'Small', value: 'SMALL' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Large', value: 'LARGE' },
    { label: 'Enterprise', value: 'ENTERPRISE' },
];

export const typeOptions = [
    { label: 'Startup', value: 'STARTUP' },
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Nonprofit', value: 'NONPROFIT' },
];

export const seniorityOptions = [
    { label: 'Entry', value: 'ENTRY' },
    { label: 'Mid', value: 'MID' },
    { label: 'Senior', value: 'SENIOR' },
    { label: 'Principal', value: 'PRINCIPAL' },
    { label: 'VP', value: 'VP' },
];

export const contactStatusOptions = [
    { label: 'To Reach Out', value: 'TO_REACH_OUT', severity: 'secondary' },
    { label: 'Reached Out', value: 'REACHED_OUT', severity: 'info' },
    { label: 'Responded', value: 'RESPONDED', severity: 'warn' },
    { label: 'Connected', value: 'CONNECTED', severity: 'info' },
    { label: 'Meeting Scheduled', value: 'MEETING_SCHEDULED', severity: 'warn' },
    { label: 'Referred', value: 'REFERRED', severity: 'success' },
    { label: 'No Response', value: 'NO_RESPONSE', severity: 'danger' },
    { label: 'Not Interested', value: 'NOT_INTERESTED', severity: 'danger' },
];

export const statusOptions = [
    { label: 'Not Started', value: 'NOT_STARTED', severity: 'secondary' },
    { label: 'Applied (No Referral)', value: 'APPLIED_NO_REFERRAL', severity: 'info' },
    { label: 'Applied (With Referral)', value: 'APPLIED_WITH_REFERRAL', severity: 'info' },
    { label: 'Phone Screen', value: 'PHONE_SCREEN', severity: 'info' },
    { label: 'Early Stages', value: 'EARLY_STAGES', severity: 'warn' },
    { label: 'Final Round', value: 'FINAL_ROUND', severity: 'warn' },
    { label: 'Offer Received', value: 'OFFER_RECEIVED', severity: 'success' },
    { label: 'Offer Accepted', value: 'OFFER_ACCEPTED', severity: 'success' },
    { label: 'Offer Declined', value: 'OFFER_DECLINED', severity: 'danger' },
    { label: 'Rejected', value: 'REJECTED', severity: 'danger' },
    { label: 'Withdrawn', value: 'WITHDRAWN', severity: 'danger' },
];

export const priorityOptions = [
    { label: 'Low', value: 'LOW', severity: 'secondary' },
    { label: 'Medium', value: 'MEDIUM', severity: 'warn' },
    { label: 'High', value: 'HIGH', severity: 'success' },
];

export const remoteTypeOptions = [
    { label: 'Onsite', value: 'ONSITE', severity: 'danger' },
    { label: 'Hybrid', value: 'HYBRID', severity: 'warn' },
    { label: 'Remote', value: 'REMOTE', severity: 'success' },
    { label: 'Flexible', value: 'FLEXIBLE', severity: 'secondary' },
];

export const preferenceOptions = [
    { label: 'Strongly Prefer', value: 'STRONGLY_PREFER', severity: 'success' },
    { label: 'Prefer', value: 'PREFER', severity: 'info' },
    { label: 'Neutral', value: 'NEUTRAL', severity: 'secondary' },
    { label: 'Avoid', value: 'AVOID', severity: 'warn' },
    { label: 'Dealbreaker', value: 'DEALBREAKER', severity: 'danger' },
];

// Helper function to get severity for a value
export const getSeverity = (
    options: Array<{ value: string; severity?: string }>,
    value: string
): string => {
    return options.find((opt) => opt.value === value)?.severity || 'secondary';
};

// Helper function to get label for a value
export const getLabel = (
    options: Array<{ value: string; label: string }>,
    value: string
): string => {
    return options.find((opt) => opt.value === value)?.label || value;
};