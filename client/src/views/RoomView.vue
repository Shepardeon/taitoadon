<template>
  <!-- <div class="drawer drawer-open">
    <div class="drawer-content flex flex-col items-center">
      <div class="text-xl text-bold">Room: {{ room?.roomId }}</div>
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
      <label class="text-bold">Liste des joueurs :</label>
      <ul class="menu bg-base-200 min-h-full w-80 p-4">
        <li v-for="player in room?.state.players">{{ player.name }}</li>
      </ul>
    </div>
  </div> -->

  <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <div class="text-xl text-bold">Room: {{ room?.roomId }}</div>
      {{ room?.state }}

      <label for="my-drawer-3" class="btn drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <ul class="menu bg-base-200 min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <li v-for="player in room?.state.players">{{ player }} wat</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useRoomStore } from "../stores/room.store";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";

const { room, isConnected } = storeToRefs(useRoomStore());
const router$ = useRouter();

const reactiveRoom = computed(() => room.value);

onMounted(() => {
  console.log(room.value);
  if (!isConnected.value) {
    router$.replace("/");
  }
});
</script>
