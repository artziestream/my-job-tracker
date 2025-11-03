<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import ReferralSettingsDrawer from './components/ReferralSettingsDrawer.vue'

const showSettings = ref(false)
</script>

<template>
  <Toast />
  <div id="app">
    <nav class="navbar">
      <div class="nav-left">
        <h1>Job Application Tracker</h1>
      </div>

      <div class="nav-center">
        <RouterLink to="/companies">Companies</RouterLink>
        <RouterLink to="/applications">Applications</RouterLink>
      </div>

      <div class="nav-right">
        <Button icon="pi pi-cog" label="Referral Settings" text class="settings-btn" @click="showSettings = true" />
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <ReferralSettingsDrawer v-model:visible="showSettings" />
  </div>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.nav-left h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav-center {
  display: flex;
  gap: 2rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-center a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-center a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-center a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
}

.nav-right {
  display: flex;
  align-items: center;
}

.settings-btn {
  color: rgba(255, 255, 255, 0.9) !important;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>