<template>
  <ul>
    <PlayerItem v-for="(player, id) in players" :key="id" :player />
  </ul>
</template>

<script lang="ts" setup>
import PlayerItem from "./PlayerItem.vue";
import { Player } from "../../models/game.model";
import { PropType } from "vue";

const props = defineProps({
  players: {
    type: Object as PropType<{ [sessionId: string]: Player }>,
    default: () => [],
  },
});
</script>
