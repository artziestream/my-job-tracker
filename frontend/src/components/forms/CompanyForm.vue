<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { sizeOptions, typeOptions } from '../../constants/options';

interface Props {
    initialData?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['save', 'cancel']);

const formData = ref({
    name: '',
    size: null as string | null,
    type: null as string | null,
    comments: '',
});

watch(
    () => props.initialData,
    (data) => {
        if (data) {
            formData.value = {
                name: data.name || '',
                size: data.size || null,
                type: data.type || null,
                comments: data.comments || '',
            };
        } else {
            formData.value = {
                name: '',
                size: null,
                type: null,
                comments: '',
            };
        }
    },
    { immediate: true }
);

const handleSave = () => {
    if (!formData.value.name.trim()) {
        alert('Company name is required');
        return;
    }

    const data = {
        name: formData.value.name,
        size: formData.value.size,
        type: formData.value.type,
        comments: formData.value.comments || undefined,
    };

    emit('save', data);
};
</script>

<template>
    <div class="form">
        <div class="field">
            <label>Company Name *</label>
            <InputText v-model="formData.name" placeholder="Enter name" fluid />
        </div>

        <div class="field">
            <label>Size</label>
            <Select v-model="formData.size" :options="sizeOptions" optionLabel="label" optionValue="value"
                placeholder="Select size" fluid />
        </div>

        <div class="field">
            <label>Type</label>
            <Select v-model="formData.type" :options="typeOptions" optionLabel="label" optionValue="value"
                placeholder="Select type" fluid />
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

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.5rem;
}
</style>