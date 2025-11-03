<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import {
    statusOptions,
    remoteTypeOptions,
    preferenceOptions,
} from '../../constants/options';

interface Props {
    initialData?: any;
    companies: any[];
}

const props = defineProps<Props>();
const emit = defineEmits(['save', 'cancel']);

const formData = ref({
    jobTitle: '',
    companyId: '',
    linkedinUrl: '',
    companyJobUrl: '',
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    status: 'NOT_STARTED' as string,
    location: '',
    remoteType: null as string | null,
    preference: 'NEUTRAL' as string,
    postedDate: '',
    postingEndDate: '',
    appliedDate: '',
    comments: '',
});

const companyOptions = computed(() =>
    props.companies.map((c) => ({ label: c.name, value: c.id }))
);

watch(
    () => props.initialData,
    (data) => {
        if (data) {
            formData.value = {
                jobTitle: data.jobTitle || '',
                companyId: data.company?.id || '',
                linkedinUrl: data.linkedinUrl || '',
                companyJobUrl: data.companyJobUrl || '',
                salaryMin: data.salaryMin || null,
                salaryMax: data.salaryMax || null,
                status: data.status || 'NOT_STARTED',
                location: data.location || '',
                remoteType: data.remoteType || null,
                preference: data.preference || 'NEUTRAL',
                postedDate: data.postedDate || '',
                postingEndDate: data.postingEndDate || '',
                appliedDate: data.appliedDate || '',
                comments: data.comments || '',
            };
        } else {
            formData.value = {
                jobTitle: '',
                companyId: '',
                linkedinUrl: '',
                companyJobUrl: '',
                salaryMin: null,
                salaryMax: null,
                status: 'NOT_STARTED',
                location: '',
                remoteType: null,
                preference: 'NEUTRAL',
                postedDate: '',
                postingEndDate: '',
                appliedDate: '',
                comments: '',
            };
        }
    },
    { immediate: true }
);

const handleSave = () => {
    if (!formData.value.jobTitle.trim() || !formData.value.companyId) {
        alert('Job title and company are required');
        return;
    }

    const data = {
        jobTitle: formData.value.jobTitle,
        companyId: formData.value.companyId,
        linkedinUrl: formData.value.linkedinUrl || undefined,
        companyJobUrl: formData.value.companyJobUrl || undefined,
        salaryMin: formData.value.salaryMin,
        salaryMax: formData.value.salaryMax,
        status: formData.value.status,
        location: formData.value.location || undefined,
        remoteType: formData.value.remoteType,
        preference: formData.value.preference,
        postedDate: formData.value.postedDate || undefined,
        postingEndDate: formData.value.postingEndDate || undefined,
        appliedDate: formData.value.appliedDate || undefined,
        comments: formData.value.comments || undefined,
    };

    emit('save', data);
};
</script>

<template>
    <div class="form">
        <div class="field">
            <label>Job Title *</label>
            <InputText v-model="formData.jobTitle" fluid />
        </div>

        <div class="field">
            <label>Company *</label>
            <Select v-model="formData.companyId" :options="companyOptions" optionLabel="label" optionValue="value"
                placeholder="Select company" fluid />
        </div>

        <div class="field">
            <label>LinkedIn URL</label>
            <InputText v-model="formData.linkedinUrl" fluid />
        </div>

        <div class="field">
            <label>Company Job URL</label>
            <InputText v-model="formData.companyJobUrl" fluid />
        </div>

        <div class="field">
            <label>Status</label>
            <Select v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" fluid />
        </div>

        <div class="field">
            <label>Location</label>
            <InputText v-model="formData.location" fluid />
        </div>

        <div class="field">
            <label>Remote Type</label>
            <Select v-model="formData.remoteType" :options="remoteTypeOptions" optionLabel="label" optionValue="value"
                fluid />
        </div>

        <div class="field">
            <label>Preference</label>
            <Select v-model="formData.preference" :options="preferenceOptions" optionLabel="label" optionValue="value"
                fluid />
        </div>

        <div class="field-row">
            <div class="field">
                <label>Posted Date</label>
                <InputText v-model="formData.postedDate" type="date" fluid />
            </div>
            <div class="field">
                <label>Posting End Date</label>
                <InputText v-model="formData.postingEndDate" type="date" fluid />
            </div>
        </div>

        <div class="field-row">
            <div class="field">
                <label>Min Salary</label>
                <InputNumber v-model="formData.salaryMin" mode="currency" currency="USD" fluid />
            </div>
            <div class="field">
                <label>Max Salary</label>
                <InputNumber v-model="formData.salaryMax" mode="currency" currency="USD" fluid />
            </div>
        </div>

        <div class="field">
            <label>Comments</label>
            <Textarea v-model="formData.comments" rows="3" fluid />
        </div>

        <div class="actions">
            <Button label="Cancel" text @click="emit('cancel')" />
            <Button :label="initialData ? 'Update' : 'Create'" @click="handleSave" />
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

.field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.5rem;
}
</style>