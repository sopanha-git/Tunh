<script setup lang="ts">
import { LoaderCircle, Radio } from 'lucide-vue-next'
const props = withDefaults(defineProps<{ isGenerating: boolean; isDisabled?: boolean }>(), { isDisabled: false })
const emit = defineEmits<{ generate: [] }>()
function click() { if (!props.isGenerating && !props.isDisabled) emit('generate') }
</script>
<template>
  <button class="btn-action w-full text-base uppercase" :disabled="isGenerating || isDisabled" @click="click">
    <LoaderCircle v-if="isGenerating" :size="20" class="animate-spin" />
    <Radio v-else :size="20" />
    {{ isGenerating ? 'Rendering signal…' : 'Generate voice' }}
  </button>
</template>
