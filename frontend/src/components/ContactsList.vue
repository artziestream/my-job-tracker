<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ContactForm from './forms/ContactForm.vue'
import ApplicationContactForm from './forms/ApplicationContactForm.vue'
import {
    CREATE_CONTACT,
    UPDATE_CONTACT,
    DELETE_CONTACT,
} from '@/graphql/contacts'
import {
    LINK_CONTACT_TO_APPLICATION,
    UNLINK_CONTACT_FROM_APPLICATION,
    UPDATE_APPLICATION_CONTACT,
} from '@/graphql/applications'
import { COMPANIES_QUERY } from '@/graphql/companies'
import { contactStatusOptions, seniorityOptions } from '@/constants/options'
import { generateReferralMessage, copyToClipboard } from './utils/referralTemplate'

interface Props {
    company?: any
    application?: any
    visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'addContact', 'updated'])
const toast = useToast()

const isApplication = computed(() => !!props.application)
const entity = computed(() => props.company || props.application)

const localContacts = ref<any[]>([])
const showEdit = ref(false)
const editingContact = ref<any>(null)
const showAdd = ref(false)
const selectedContact = ref<any>(null)
const linkRole = ref('')
const newContactRole = ref('')
const contactFormRef = ref<InstanceType<typeof ContactForm> | null>(null)

// Copy referral message to clipboard
const copyReferralMessage = async (contact: any) => {
    const message = generateReferralMessage({
        contactName: contact.name,
        jobTitle: props.application?.jobTitle,
        companyName: props.application?.company?.name,
        jobLink: props.application?.linkedinUrl || props.application?.companyJobUrl,
    })

    try {
        await copyToClipboard(message)
        toast.add({
            severity: 'success',
            summary: 'Copied!',
            detail: 'Referral message copied to clipboard',
            life: 2500,
        })
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Copy Failed',
            detail: 'Could not copy to clipboard',
            life: 3000,
        })
    }
}

/* GraphQL ------------------------------------------------------------- */
const { mutate: createContact } = useMutation(CREATE_CONTACT)
const { mutate: updateContact } = useMutation(UPDATE_CONTACT)
const { mutate: deleteContact } = useMutation(DELETE_CONTACT)
const { mutate: linkContact } = useMutation(LINK_CONTACT_TO_APPLICATION)
const { mutate: unlinkContact } = useMutation(UNLINK_CONTACT_FROM_APPLICATION)
const { mutate: updateApplicationContact } = useMutation(UPDATE_APPLICATION_CONTACT)
const { result: companiesRes } = useQuery(COMPANIES_QUERY)
const companies = computed(() => companiesRes.value?.companies ?? [])

/* Reactive contacts list ---------------------------------------------- */
watch(
    [() => props.company, () => props.application],
    ([company, application]) => {
        if (isApplication.value && application?.contactLinks) {
            localContacts.value = application.contactLinks.map((link: any) => ({
                ...link.contact,
                _linkId: link.id,
                _role: link.role,
            }))
        } else if (company?.contacts) {
            localContacts.value = [...company.contacts]
        } else {
            localContacts.value = []
        }
    },
    { immediate: true, deep: true },
)

/* Helpers ------------------------------------------------------------- */
const statusLabel = (v: string) =>
    contactStatusOptions.find((s) => s.value === v)?.label ?? v
const statusSeverity = (v: string) =>
    contactStatusOptions.find((s) => s.value === v)?.severity ?? 'secondary'

const seniorityLabel = (v: string) =>
    seniorityOptions.find((s) => s.value === v)?.label ?? v

/* Duplicate Check ----------------------------------------------------- */
const isDuplicateContact = (name: string, email?: string) => {
    if (!name.trim()) return false

    return localContacts.value.some(c => {
        const nameMatch = c.name.toLowerCase().trim() === name.toLowerCase().trim()
        const emailMatch = email && c.email &&
            c.email.toLowerCase().trim() === email.toLowerCase().trim()
        return nameMatch || emailMatch
    })
}

/* CRUD: update only for company contacts ------------------------------ */
async function saveContact(data: Record<string, any>) {
    if (!editingContact.value?.id) return
    const input = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null),
    )
    const result = await updateContact({
        id: editingContact.value.id,
        input,
    })
    const updated = result?.data?.updateContact
    if (updated) {
        const i = localContacts.value.findIndex((c) => c.id === updated.id)
        if (i !== -1)
            localContacts.value[i] = { ...localContacts.value[i], ...updated }
        toast.add({ severity: 'success', summary: 'Updated', life: 2500 })
        showEdit.value = false
        editingContact.value = null
        emit('updated')
    }
}

/* Edit: contact in application --> update role + person --------------- */
async function saveApplicationContact(payload: { role: string; contact: any }) {
    const { contact, role } = payload
    try {
        if (contact.id) {
            const { id, ...contactInput } = contact

            await updateContact({
                id,
                input: Object.fromEntries(
                    Object.entries(contactInput).filter(([_, v]) => v !== undefined),
                ),
            })
        }
        if (editingContact.value?._linkId) {
            await updateApplicationContact({
                id: editingContact.value._linkId,
                role,
            })
        }

        const index = localContacts.value.findIndex(
            (c) => c._linkId === editingContact.value._linkId,
        )
        if (index !== -1) {
            localContacts.value[index]._role = role
            Object.assign(localContacts.value[index], contact)
        }
        toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Contact and role saved',
            life: 2500,
        })
        showEdit.value = false
        emit('updated')
    } catch (err: any) {
        console.error(err)
        toast.add({
            severity: 'error',
            summary: 'Update failed',
            detail: err.message,
            life: 4000,
        })
    }
}

/* Delete / Unlink ----------------------------------------------------- */
async function removeContact(c: any) {
    const message = isApplication.value
        ? 'Remove this contact from the application?'
        : 'Delete this contact permanently?'
    if (!confirm(message)) return

    try {
        if (isApplication.value) {
            await unlinkContact({ applicationContactId: c._linkId })
            localContacts.value = localContacts.value.filter(
                (x) => x._linkId !== c._linkId,
            )
        } else {
            await deleteContact({ id: c.id })
            localContacts.value = localContacts.value.filter((x) => x.id !== c.id)
        }

        toast.add({ severity: 'success', summary: 'Removed', life: 2500 })
        emit('updated')
    } catch (err: any) {
        toast.add({
            severity: 'error',
            summary: 'Remove failed',
            detail: err.message,
            life: 4000,
        })
    }
}

/* Link existing contact ----------------------------------------------- */
const availableCompanyContacts = computed(() => {
    if (!isApplication.value) return []
    const companyId = props.application?.company?.id
    return companies.value.find((c: { id: any }) => c.id === companyId)
        ?.contacts ?? []
})

async function linkExisting() {
    if (!selectedContact.value) return

    const alreadyLinked = localContacts.value.some(
        c => c.id === selectedContact.value.id
    )

    if (alreadyLinked) {
        toast.add({
            severity: 'warn',
            summary: 'Already Linked',
            detail: 'This contact is already linked to this application.',
            life: 3000,
        })
        return
    }

    try {
        const result = await linkContact({
            applicationId: props.application.id,
            contactId: selectedContact.value.id,
            role: linkRole.value || null,
        })
        const created = result?.data?.linkContactToApplication
        if (created) {
            localContacts.value.push({
                ...created.contact,
                _linkId: created.id,
                _role: created.role,
            })
            toast.add({ severity: 'success', summary: 'Linked', life: 2000 })
            emit('updated')
        }
        showAdd.value = false
        selectedContact.value = null
        linkRole.value = ''
    } catch (err: any) {
        toast.add({
            severity: 'error',
            summary: 'Link failed',
            detail: err.message,
            life: 4000,
        })
    }
}

/* Create new contact for application ---------------------------------- */
async function handleCreateNewContact(contactData: any) {
    if (isDuplicateContact(contactData.name, contactData.email)) {
        toast.add({
            severity: 'warn',
            summary: 'Duplicate Contact',
            detail: 'A contact with this name or email already exists.',
            life: 4000,
        })
        return
    }

    try {
        const result = await createContact({
            input: contactData,
        })

        const newContact = result?.data?.createContact
        if (!newContact) throw new Error('Failed to create contact')

        const linkResult = await linkContact({
            applicationId: props.application.id,
            contactId: newContact.id,
            role: newContactRole.value || null,
        })

        const created = linkResult?.data?.linkContactToApplication
        if (created) {
            localContacts.value.push({
                ...created.contact,
                _linkId: created.id,
                _role: created.role,
            })
            toast.add({
                severity: 'success',
                summary: 'Created & Linked',
                life: 2500,
            })
            emit('updated')
        }

        showAdd.value = false
        newContactRole.value = ''
    } catch (err: any) {
        console.error(err)
        toast.add({
            severity: 'error',
            summary: 'Creation failed',
            detail: err.message,
            life: 4000,
        })
    }
}

/* Trigger ContactForm save -------------------------------------------- */
function triggerContactFormSave() {
    if (contactFormRef.value) {
        const formData = contactFormRef.value.formData

        if (!formData.name.trim()) {
            toast.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Contact name is required',
                life: 3000,
            })
            return
        }

        const contactData: any = {
            name: formData.name,
            contactStatus: formData.contactStatus,
            seniority: formData.seniority,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            title: formData.title || undefined,
            linkedinProfile: formData.linkedinProfile || undefined,
            referredBy: formData.referredBy || undefined,
            notes: formData.notes || undefined,
            companyId: props.application?.company?.id,
        }

        handleCreateNewContact(contactData)
    }
}

/* Create contact for company (non-application context) ---------------- */
function handleAddContactForCompany() {
    emit('addContact', entity.value)
}
</script>

<template>
    <Dialog :visible="visible" modal :header="`Contacts for ${entity?.name || entity?.jobTitle || ''}`"
        :style="{ width: '90rem', maxWidth: '95vw' }" @update:visible="emit('close')">
        <div v-if="!localContacts.length" class="empty">
            <p>No contacts found.</p>
        </div>

        <div v-else class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th v-if="isApplication">Role</th>
                        <th>Title</th>
                        <th>Seniority</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Referred By</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in localContacts" :key="c._linkId || c.id">
                        <td>
                            <a v-if="c.linkedinProfile" :href="c.linkedinProfile" target="_blank" rel="noopener"
                                class="contact-name-link">
                                {{ c.name }}
                                <i class="pi pi-linkedin" style="font-size: 0.9rem; margin-left: 0.25rem;"></i>
                            </a>
                            <span v-else>{{ c.name }}</span>
                        </td>
                        <td v-if="isApplication">{{ c._role || '-' }}</td>
                        <td>{{ c.title || '-' }}</td>
                        <td>
                            <Tag v-if="c.seniority" :value="seniorityLabel(c.seniority)" severity="info" />
                            <span v-else>-</span>
                        </td>
                        <td>{{ c.email || '-' }}</td>
                        <td>{{ c.phone || '-' }}</td>
                        <td>
                            <Tag v-if="c.contactStatus" :value="statusLabel(c.contactStatus)"
                                :severity="statusSeverity(c.contactStatus)" />
                        </td>
                        <td>{{ c.referredBy || '-' }}</td>
                        <td>
                            <span class="notes-cell" :title="c.notes">
                                {{ c.notes ? (c.notes.length > 30 ? c.notes.substring(0, 30) + '...' : c.notes) : '-' }}
                            </span>
                        </td>
                        <td class="actions">
                            <Button v-if="isApplication" icon="pi pi-copy" text rounded severity="secondary"
                                v-tooltip.top="'Copy referral message'" @click="copyReferralMessage(c)" />
                            <Button icon="pi pi-pencil" text rounded @click="editingContact = c; showEdit = true" />
                            <Button icon="pi pi-trash" text rounded severity="danger" @click="removeContact(c)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <template #footer>
            <div class="footer-actions">
                <div class="right-actions">
                    <Button v-if="isApplication" label="Add / Link Contact" icon="pi pi-plus" @click="showAdd = true" />
                    <Button v-else label="Add Contact" icon="pi pi-plus" @click="handleAddContactForCompany" />
                    <Button label="Close" text @click="emit('close')" />
                </div>
            </div>
        </template>

        <!-- Edit Dialog -->
        <Dialog v-model:visible="showEdit" modal :header="isApplication ? 'Edit Application Contact' : 'Edit Contact'"
            :style="{ width: '40rem' }">
            <ApplicationContactForm v-if="isApplication" :initial-data="editingContact" @save="saveApplicationContact"
                @cancel="showEdit = false" />

            <ContactForm v-else :initial-data="editingContact" :company-id="entity?.id || entity?.company?.id"
                @save="saveContact" @cancel="showEdit = false" />
        </Dialog>

        <!-- Add/Link Dialog -->
        <Dialog v-model:visible="showAdd" modal header="Link or Create Contact" :style="{ width: '45rem' }">
            <div class="link-section">
                <h4 class="section-heading">Link Existing Contact</h4>
                <div class="field">
                    <label>Choose Existing Contact</label>
                    <Dropdown v-model="selectedContact" :options="availableCompanyContacts" optionLabel="name"
                        placeholder="Select from company" class="w-full" />
                </div>
                <div class="field">
                    <label>Role (optional)</label>
                    <InputText v-model="linkRole" type="text" placeholder="Recruiter, Referral..." fluid />
                </div>
                <div class="actions">
                    <Button label="Link Contact" icon="pi pi-link" :disabled="!selectedContact" @click="linkExisting" />
                </div>
            </div>

            <div class="divider-with-text">
                <span>OR</span>
            </div>

            <div class="create-section">
                <h4 class="section-heading">Create New Contact</h4>
                <div class="field">
                    <label>Role (optional)</label>
                    <InputText v-model="newContactRole" type="text" placeholder="Recruiter, Referral..." fluid />
                </div>
                <ContactForm ref="contactFormRef" :company-id="props.application?.company?.id" :show-buttons="false" />
                <div class="actions">
                    <Button label="Cancel" text @click="showAdd = false" />
                    <Button label="Create & Link" icon="pi pi-plus" @click="triggerContactFormSave" />
                </div>
            </div>
        </Dialog>

    </Dialog>
</template>

<style scoped>
.table-container {
    overflow-x: auto;
    max-width: 100%;
}

.table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1200px;
}

.table th,
.table td {
    border-bottom: 1px solid var(--border-primary);
    padding: 0.75rem;
    text-align: left;
}

.table th {
    color: var(--text-secondary);
    text-transform: uppercase;
    font-size: 0.85rem;
    white-space: nowrap;
}

.table tbody tr:hover {
    background: var(--bg-secondary);
}

.contact-name-link {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
}

.contact-name-link:hover {
    text-decoration: underline;
}

.notes-cell {
    display: block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.empty {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.actions {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
}

.footer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.right-actions {
    display: flex;
    gap: 0.5rem;
}

.field {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
}

.field label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.link-section,
.create-section {
    padding: 1rem 0;
}

.section-heading {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 600;
}

.divider-with-text {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 2rem 0;
}

.divider-with-text::before,
.divider-with-text::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-primary);
}

.divider-with-text span {
    padding: 0 1rem;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.9rem;
}
</style>