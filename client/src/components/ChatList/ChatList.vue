<template>
  <ul>
    <li>
      <ChatItem :content="proposition" proposition />
      <ChatItem
        v-for="r in responses"
        :content="r.response"
        :player-id="r.playerId"
        :is-round-master
        @taitoa="onTaitoa"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { PlayerResponse } from "../../models/game.model";
import ChatItem from "./ChatItem.vue";

const props = defineProps({
  isRoundMaster: {
    type: Boolean,
    default: () => false,
  },
  proposition: {
    type: String,
    required: true,
  },
  responses: {
    type: Array<PlayerResponse>,
    required: true,
  },
});

const emits = defineEmits<{
  taitoa: [string];
}>();

function onTaitoa(playerId: string) {
  emits("taitoa", playerId);
}
</script>
