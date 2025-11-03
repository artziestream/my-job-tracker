<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
    title: string;
}>();
</script>

<template>
    <div class="page-container">
        <Card class="page-card">
            <template #title>
                <div class="page-header">
                    <h2>{{ title }}</h2>
                    <slot name="actions" />
                </div>
            </template>

            <template #content>
                <div class="page-content">
                    <slot />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.page-container {
    padding: 1.5rem;
    width: 100%;
}

.page-card {
    width: 100%;
    max-width: 100%;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 0;
}

.page-header h2 {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.page-content {
    width: 100%;
    overflow-x: auto;
}
</style>