<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'select';
    placeholder: string;
    options?: { label: string; value: string }[];
}

interface Props {
    filters: Record<string, any>;
    fields: FilterField[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:filters']);

const updateFilter = (key: string, value: any) => {
    emit('update:filters', { ...props.filters, [key]: value });
};
</script>

<template>
    <div class="filters">
        <div v-for="field in fields" :key="field.key" class="filter-field">
            <label>{{ field.label }}</label>
            <InputText v-if="field.type === 'text'" :model-value="filters[field.key]" :placeholder="field.placeholder"
                @update:model-value="updateFilter(field.key, $event)" fluid />
            <Select v-else-if="field.type === 'select'" :model-value="filters[field.key]" :options="field.options"
                optionLabel="label" optionValue="value" :placeholder="field.placeholder" showClear
                @update:model-value="updateFilter(field.key, $event)" fluid />
        </div>
    </div>
</template>

<style scoped>
.filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
}

.filter-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-field label {
    color: var(--text-primary);
}
</style>