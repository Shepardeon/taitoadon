<template>
  <ul>
    <li>
      <ChatItem :content="proposition" proposition />
      <ChatItem
        v-for="r in internalResponses"
        :content="r.response"
        :player-id="r.playerId"
        :is-round-master
        @taitoa="onTaitoa"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import ChatItem from "./ChatItem.vue";
import { onMounted, ref } from "vue";
import { PlayerResponse } from "../../models/game.model";
import { useSpeech } from "../../composables/speech.composable";

const speech = useSpeech();
const internalResponses = ref<PlayerResponse[]>([]);

onMounted(() => {
  speech.sayWithRandomVoice(props.proposition, sayNextLine);
});

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
  speech.cancelUtterance();
}

function sayNextLine() {
  if (internalResponses.value.length === props.responses.length) {
    return;
  }

  const nextLine = props.responses[internalResponses.value.length];
  internalResponses.value.push(nextLine);

  speech.sayWithRandomVoice(nextLine.response, sayNextLine);
}
</script>
