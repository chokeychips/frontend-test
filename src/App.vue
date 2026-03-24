<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style scoped>
nav {
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  text-decoration: none;
  color: var(--color-text);
}

nav a.router-link-exact-active {
  color: var(--color-text-secondary);
  font-weight: bold;
}
</style>
