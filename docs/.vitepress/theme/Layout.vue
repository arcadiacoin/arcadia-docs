<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute, useData } from 'vitepress'
const { Layout } = DefaultTheme
</script>

<template>
  <div class="relative mx-auto xl:max-w-screen-xl overflow:hidden">
    <Layout>
      <template #sidebar-top>
      </template>
    </Layout>
  </div>
</template>
