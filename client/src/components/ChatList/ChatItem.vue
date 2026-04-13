<template>
  <div
    :class="{ chat: true, 'chat-start': proposition, 'chat-end': !proposition }"
  >
    <div
      :class="{
        'chat-bubble': true,
        'chat-bubble-primary': proposition,
        'chat-bubble-secondary': !proposition,
      }"
    >
      {{ content }}
    </div>

    <div v-if="!proposition && isRoundMaster" class="chat-footer mt-1">
      <button class="btn btn-sm btn-error btn-outline" @click="onClick">
        TAITOADON !
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  isRoundMaster: {
    type: Boolean,
    default: () => false,
  },
  proposition: {
    type: Boolean,
    default: () => false,
  },
  content: {
    type: String,
    required: true,
  },
  playerId: {
    type: String,
    default: () => "",
  },
});

const emits = defineEmits<{
  taitoa: [string];
}>();

function onClick() {
  emits("taitoa", props.playerId);
}
</script>
