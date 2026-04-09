<template>
  <div v-if="room.initialized" class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <div class="text-xl text-bold">Room: {{ room.sessionId }}</div>
      {{ room.players }}

      <a class="btn" @click="onTestSend">test</a>

      <label for="my-drawer-3" class="btn drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <ul class="menu bg-base-200 min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <li v-for="(player, id) in room.players" :key="id">
          {{ player.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
