<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-header">
          <h2>{{ title }}</h2>
          <slot name="actions" />
        </div>
      </template>

      <template #content>
        <slot />
      </template>
    </Card>
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}
</style>