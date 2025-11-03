<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <h1>Job Application Tracker</h1>
      <div class="nav-links">
        <RouterLink to="/companies">Companies</RouterLink>
        <RouterLink to="/applications">Applications</RouterLink>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
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

.navbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
}
</style>