<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import {
    seniorityOptions,
    contactStatusOptions,
} from '../../constants/options'

interface Props {
    companyId?: string
    initialData?: any
    showButtons?: boolean // New prop to control button visibility
}

const props = withDefaults(defineProps<Props>(), {
    showButtons: true,
})

const emit = defineEmits(['save', 'cancel', 'update:modelValue'])

const isEditMode = computed(() => !!props.initialData)

const formData = ref({
    name: '',
    email: '',
    phone: '',
    title: '',
    linkedinProfile: '',
    seniority: null as string | null,
    contactStatus: 'TO_REACH_OUT' as string,
    referredBy: '',
    notes: '',
})

watch(
    () => props.initialData,
    (newVal) => {
        if (newVal) {
            formData.value = {
                name: newVal.name || '',
                email: newVal.email || '',
                phone: newVal.phone || '',
                title: newVal.title || '',
                linkedinProfile: newVal.linkedinProfile || '',
                seniority: newVal.seniority || null,
                contactStatus: newVal.contactStatus || 'TO_REACH_OUT',
                referredBy: newVal.referredBy || '',
                notes: newVal.notes || '',
            }
        } else {
            formData.value = {
                name: '',
                email: '',
                phone: '',
                title: '',
                linkedinProfile: '',
                seniority: null,
                contactStatus: 'TO_REACH_OUT',
                referredBy: '',
                notes: '',
            }
        }
    },
    { immediate: true }
)

// Emit changes for parent to track
watch(
    formData,
    (newVal) => {
        emit('update:modelValue', newVal)
    },
    { deep: true }
)

const handleSave = () => {
    if (!formData.value.name.trim()) {
        alert('Contact name is required')
        return
    }

    const data: any = {
        name: formData.value.name,
        contactStatus: formData.value.contactStatus,
        seniority: formData.value.seniority,
        email: formData.value.email || undefined,
        phone: formData.value.phone || undefined,
        title: formData.value.title || undefined,
        linkedinProfile: formData.value.linkedinProfile || undefined,
        referredBy: formData.value.referredBy || undefined,
        notes: formData.value.notes || undefined,
    }

    if (!isEditMode.value && props.companyId) {
        data.companyId = props.companyId
    }

    emit('save', data)
}

// Expose formData for parent access
defineExpose({ formData })
</script>

<template>
    <div class="form">
        <div class="field">
            <label>Name *</label>
            <InputText v-model="formData.name" placeholder="Enter name" fluid />
        </div>

        <div class="field">
            <label>Title</label>
            <InputText v-model="formData.title" placeholder="e.g. Software Engineer" fluid />
        </div>

        <div class="field">
            <label>Email</label>
            <InputText v-model="formData.email" type="email" placeholder="email@example.com" fluid />
        </div>

        <div class="field">
            <label>Phone</label>
            <InputText v-model="formData.phone" placeholder="(123) 456-7890" fluid />
        </div>

        <div class="field">
            <label>LinkedIn Profile</label>
            <InputText v-model="formData.linkedinProfile" placeholder="https://linkedin.com/in/..." fluid />
        </div>

        <div class="field">
            <label>Seniority</label>
            <Select v-model="formData.seniority" :options="seniorityOptions" optionLabel="label" optionValue="value"
                placeholder="Select seniority" fluid />
        </div>

        <div class="field">
            <label>Status</label>
            <Select v-model="formData.contactStatus" :options="contactStatusOptions" optionLabel="label"
                optionValue="value" placeholder="Select status" fluid />
        </div>

        <div class="field">
            <label>Referred By</label>
            <InputText v-model="formData.referredBy" placeholder="Who referred you?" fluid />
        </div>

        <div class="field">
            <label>Notes</label>
            <Textarea v-model="formData.notes" rows="3" placeholder="Additional notes..." fluid />
        </div>

        <div v-if="showButtons" class="actions">
            <Button label="Cancel" text @click="emit('cancel')" />
            <Button :label="isEditMode ? 'Save Changes' : 'Create'" @click="handleSave" />
        </div>
    </div>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.5rem;
}
</style>