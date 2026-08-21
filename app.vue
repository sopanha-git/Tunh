<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "antialiased",
  },
});
</script>
