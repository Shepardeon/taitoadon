<template>
  <SidebarPage>
    <template #nav>
      <div class="text-xl text-bold w-full text-center">
        Room: {{ room.sessionId }} - {{ Object.keys(room.players).length }} / 20
      </div>
    </template>

    <div class="flex h-full w-full items-center justify-center">
      <div class="lg:max-w-200 w-full">
        <div class="text-xl text-bold text-center mb-5">
          <div v-if="isProposePhase">
            <span v-if="isRoundMaster">
              Les joueurs choisissent une réponse...
            </span>
            <span v-else>Choisissez une réponse à l'intervention</span>
          </div>

          <div v-if="isChoicePhase">
            <span v-if="isRoundMaster">
              Choisissez la réponse la moins drôle !
            </span>
            <span v-else>Le chef du round choisi un message...</span>
          </div>
        </div>

        <div>
          {{ room.state?.roundState }}
        </div>

        <div v-if="!isGameStarted" class="text-3xl text-bold">
          En attente du démarrage de la partie...
        </div>

        <div v-if="isProposePhase">
          <div class="text-xl text-bold">Prochaine intervention :</div>
          <div>
            {{ room.state?.proposition }}
          </div>
        </div>

        <div v-if="isChoicePhase">
          <div class="scrollable-content">
            <ChatList
              :proposition="room.state?.proposition ?? ''"
              :responses="playerResponses"
              :is-round-master="isRoundMaster"
            />
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
import ChatList from "../components/ChatList/ChatList.vue";
import { useRoomStore } from "../stores/room.store";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { PlayerResponse } from "../models/game.model";

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

const playerResponses = computed(() =>
  Object.values(room.players)
    .map(
      (player) =>
        ({
          playerId: player.sessionId,
          response: player.response,
        }) as PlayerResponse,
    )
    .filter((r) => r.playerId !== room.state?.roundMasterId),
);

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

.scrollable-content {
  height: 80vh;
  overflow-y: auto;
}
</style>
