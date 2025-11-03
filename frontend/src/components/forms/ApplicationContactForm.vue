<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ContactForm from './ContactForm.vue'

interface Props {
    initialData?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

const role = ref('')
const contactFormRef = ref<InstanceType<typeof ContactForm> | null>(null)

watch(
    () => props.initialData,
    (val) => {
        role.value = val?._role || val?.role || ''
    },
    { immediate: true }
)

function handleSave() {
    if (!contactFormRef.value) return

    const contactData = contactFormRef.value.formData

    if (!contactData.name.trim()) {
        alert('Contact name is required')
        return
    }

    // Build clean contact object for mutation (no id in the data)
    const contactInput = {
        name: contactData.name,
        email: contactData.email || undefined,
        phone: contactData.phone || undefined,
        title: contactData.title || undefined,
        linkedinProfile: contactData.linkedinProfile || undefined,
        seniority: contactData.seniority || undefined,
        contactStatus: contactData.contactStatus,
        referredBy: contactData.referredBy || undefined,
        notes: contactData.notes || undefined,
    }

    emit('save', {
        role: role.value,
        contact: {
            id: props.initialData?.id, // Keep id for mutation variable
            ...contactInput,
        },
    })
}
</script>

<template>
    <div class="application-contact-form">
        <div class="field">
            <label>Role</label>
            <InputText v-model="role" placeholder="Recruiter, Hiring Manager, Referral..." fluid />
            <small class="help-text">
                What role does this contact play in your application?
            </small>
        </div>

        <div class="divider"></div>

        <h4 class="section-title">Contact Information</h4>

        <ContactForm ref="contactFormRef" :initial-data="initialData" :show-buttons="false" />

        <div class="actions">
            <Button label="Cancel" text @click="emit('cancel')" />
            <Button label="Save" icon="pi pi-check" @click="handleSave" />
        </div>
    </div>
</template>

<style scoped>
.application-contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.help-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.divider {
    height: 1px;
    background: var(--border-primary);
    margin: 0.5rem 0;
}

.section-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-primary);
}
</style>