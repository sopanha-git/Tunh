<script setup lang="ts">
import { LoaderCircle, Mic2 } from 'lucide-vue-next'
const props = withDefaults(defineProps<{ isGenerating: boolean; isDisabled?: boolean }>(), { isDisabled: false })
const emit = defineEmits<{ generate: [] }>()
function click() { if (!props.isGenerating && !props.isDisabled) emit('generate') }
</script>
<template><button class="btn-primary w-full py-4 text-base" :disabled="isGenerating || isDisabled" @click="click"><LoaderCircle v-if="isGenerating" :size="20" class="animate-spin" /><Mic2 v-else :size="20" />{{ isGenerating ? 'Generating your voice…' : 'Generate voice' }}</button></template>
