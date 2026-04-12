<template>
  <SidebarPage>
    <template #nav>
      <div class="text-xl text-bold w-full text-center">
        Room: {{ room.sessionId }} - {{ Object.keys(room.players).length }} / 20
      </div>
    </template>

    <div class="flex h-full w-full items-center justify-center">
      <div>
        <div>
          {{ room.state?.roundState }}
        </div>

        <div v-if="!isGameStarted" class="text-3xl text-bold">
          En attente du démarrage de la partie...
        </div>

        <div v-if="isProposePhase">
          <div class="text-xl text-bold">Prochaine proposition :</div>
          <div>
            {{ room.state?.proposition }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center m-5">
      <div v-if="isProposePhase" class="flex gap-3">
        <ResponseCard
          v-for="card in room.me?.cards"
          :card
          :disable="isRoundMaster"
          @choose="onChooseResponse"
        />
      </div>

      <!-- 
      <div>
        <pre>
        {{ room.players }}
        </pre>
      </div> -->

      <button
        v-if="isHost && !isGameStarted"
        class="btn btn-primary text-lg"
        @click="startGame"
      >
        Lancer la partie
      </button>
    </div>

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
import ResponseCard from "../components/ResponseCard.vue";
import { useRoomStore } from "../stores/room.store";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";

const room = useRoomStore();
const router$ = useRouter();

const isHost = computed(() => room.me?.isHost || false);
const isRoundMaster = computed(
  () => room.me?.sessionId === room.state?.roundMasterId,
);
const isGameStarted = computed(
  () => room.state?.roundState !== "waiting_for_players",
);
const isProposePhase = computed(
  () => room.state?.roundState === "propose_phase",
);
const isChoicePhase = computed(() => room.state?.roundState === "choice_phase");

onMounted(() => {
  if (!room.initialized) {
    router$.replace("/");
  }
});

function disconnect() {
  room.leave();
  router$.replace("/");
}

function startGame() {
  room.send("start");
}

function onChooseResponse(response: string) {
  room.send("respond", { response });
}
</script>

<style lang="scss" scoped>
.side-title {
  margin-bottom: 1.5em;
  border-bottom: 1px solid;
}
</style>
