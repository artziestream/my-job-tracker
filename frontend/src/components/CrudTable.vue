<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

interface Column {
    field: string;
    header: string;
    sortable?: boolean;
}

interface Props {
    data: any[];
    columns: Column[];
    loading?: boolean;
    error?: any;
}

defineProps<Props>();
const emit = defineEmits(['edit', 'delete']);
</script>

<template>
    <DataTable :value="data" :loading="loading" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"
            :sortable="col.sortable">
            <template #body="slotProps">
                <slot :name="`cell-${col.field}`" :data="slotProps.data">
                    {{ slotProps.data[col.field] }}
                </slot>
            </template>
        </Column>

        <Column header="Actions" :style="{ width: '120px' }">
            <template #body="slotProps">
                <div class="actions">
                    <Button icon="pi pi-pencil" text rounded @click="emit('edit', slotProps.data)" />
                    <Button icon="pi pi-trash" text rounded severity="danger"
                        @click="emit('delete', slotProps.data.id)" />
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
.actions {
    display: flex;
    gap: 0.5rem;
}
</style>