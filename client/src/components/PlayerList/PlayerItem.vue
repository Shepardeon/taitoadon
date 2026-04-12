<template>
  <li>
    <div class="flex justify-between">
      <div>
        <FontAwesomeIcon v-if="player.isHost" :icon="faCrown" />
        {{ player.name }}
      </div>
      <div>
        <FontAwesomeIcon v-for="n in player.lives" :key="n" :icon="fasHeart" />
        <FontAwesomeIcon
          v-for="n in 3 - player.lives"
          :key="n"
          :icon="farHeart"
        />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Player } from "../../models/game.model";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHeart as fasHeart,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
    required: true,
  },
});
</script>
