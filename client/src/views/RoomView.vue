<template>
  <SidebarPage>
    <div class="text-xl text-bold">Room: {{ room.sessionId }}</div>

    <div>
      {{ room.players }}
    </div>

    <div>This me : {{ room.me }}</div>

    <div>State : {{ room.state }}</div>

    <template #side>
      <div>
        <div class="side-title text-bold">Liste des joueurs connectés :</div>
        <PlayerList :players="room.players" />
      </div>
      <div class="text-center">
        <button class="btn btn-secondary" @click="disconnect">
          Déconnexion
        </button>
      </div>
    </template>
  </SidebarPage>
</template>

<script lang="ts" setup>
import SidebarPage from "../components/SidebarPage.vue";
import PlayerList from "../components/PlayerList/PlayerList.vue";
import { useRoomStore } from "../stores/room.store";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const room = useRoomStore();
const router$ = useRouter();

onMounted(() => {
  if (!room.initialized) {
    router$.replace("/");
  }
});

function disconnect() {
  room.leave();
  router$.replace("/");
}
</script>

<style lang="scss" scoped>
.side-title {
  margin-bottom: 1.5em;
  border-bottom: 1px solid;
}
</style>
