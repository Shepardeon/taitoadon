<template>
  <div class="flex flex-col">
    <div class="prose max-w-none text-center m-6 mb-20">
      <h1>TAITOADON!</h1>
      <p>Un jeu made by ShepShep UwU</p>
    </div>

    <div class="flex justify-center w-full">
      <div class="card card-border bg-base-200 w-100">
        <div class="card-body">
          <h2 class="card-title">Créer ou rejoidre une partie</h2>

          <form class="justify-center">
            <label v-if="!isLogged" class="input m-2">
              <span class="label">Pseudo</span>
              <input v-model="inputName" type="text" />
            </label>

            <template v-else>
              <div>Coucou, {{ username }} rentre le code du salon ici 👇</div>

              <label class="input m-2">
                <span class="label">Room</span>
                <input v-model="inputRoom" type="text" />
              </label>
            </template>

            <div class="card-actions m-2">
              <a v-if="!isLogged" @click="onCreateRoom" class="btn btn-primary">
                Créer une partie
              </a>

              <a @click="onJoinRoom" class="btn"> Rejoindre une partie </a>

              <a v-if="isLogged" class="btn btn-secondary" @click="logout">
                Retour
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user.store";
import { onMounted, ref } from "vue";
import { getRandomInt } from "../utils/random.utils";
import { useRouter } from "vue-router";
import { useRoomStore } from "../stores/room.store";

const { username, isLogged } = storeToRefs(useUserStore());
const { isConnected } = storeToRefs(useRoomStore());
const { login, logout } = useUserStore();
const { createRoomAsync, joinRoomAsync, leaveRoom } = useRoomStore();
const router$ = useRouter();

const inputName = ref<string>();
const inputRoom = ref<string>();

onMounted(() => {
  if (isConnected.value) {
    leaveRoom();
  }
});

async function onCreateRoom() {
  doLogin();
  await createRoomAsync(username.value ?? "");
  router$.push("/room");
}

async function onJoinRoom() {
  doLogin();

  if (inputRoom.value) {
    await joinRoomAsync(inputRoom.value ?? "", username.value ?? "");
    router$.push("/room");
  }
}

function doLogin() {
  if (!isLogged.value) {
    login(inputName.value ?? `User ${getRandomInt(1000)}`);
  }
}
</script>
