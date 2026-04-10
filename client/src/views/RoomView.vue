<template>
  <SidebarPage>
    <div class="text-xl text-bold">Room: {{ room.sessionId }}</div>
    {{ room.players }}

    <a class="btn" @click="onTestSend">test</a>

    <template #side>
      <div>Liste des joueurs connectés :</div>
      <ul>
        <li v-for="(player, id) in room.players" :key="id">
          {{ player.name }}
        </li>
      </ul>
    </template>
  </SidebarPage>
</template>

<script lang="ts" setup>
import SidebarPage from "../components/SidebarPage.vue";
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

function onTestSend() {
  console.log("Aled ?");
  room.send("test");
}
</script>
