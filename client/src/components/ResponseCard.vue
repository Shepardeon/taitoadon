<template>
  <div class="card h-60 max-w-60 bg-base-300">
    <div class="card-body">
      <p class="text-lg text-center">{{ card }}</p>
    </div>

    <div class="card-actions justify-center m-5">
      <button class="btn btn-primary" :disabled="disable" @click="onClick">
        Choisir
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  card: {
    type: String,
    required: true,
  },
  disable: {
    type: Boolean,
    default: () => false,
  },
});

const emits = defineEmits<{
  choose: [string];
}>();

function onClick() {
  emits("choose", props.card);
}
</script>
