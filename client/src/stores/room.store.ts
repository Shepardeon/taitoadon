import { getStateCallbacks, Room } from "@colyseus/sdk";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { GameRoom, Player } from "../models/game.model";
import { getClient } from "../services/colyseus.client";

export const useRoomStore = defineStore("room", () => {
  /**
   * STATE
   */
  const room = ref<Room>();
  const sessionId = ref<string>();
  const initialized = ref(false);

  const state = ref<GameRoom>();
  const players = reactive<{ [sessionId: string]: Player }>({});
  const me = computed(() =>
    room.value?.sessionId ? players[room.value?.sessionId] : undefined,
  );

  /**
   * ACTIONS
   */
  async function createRoom(username: string) {
    const client = getClient();

    try {
      room.value = await client.create("game_room", { username });
      sessionId.value = room.value.roomId;

      setupRoomLifecycle();
      setupStateListeners();

      initialized.value = true;
    } catch (err) {
      console.error("Join failed:", err);
      throw err;
    }
  }

  async function joinRoom(roomId: string, username: string) {
    const client = getClient();

    try {
      room.value = await client.joinById(roomId, { username });
      sessionId.value = room.value.roomId;

      setupRoomLifecycle();
      setupStateListeners();

      initialized.value = true;
    } catch (err) {
      console.error("Join failed:", err);
      throw err;
    }
  }

  async function leave() {
    if (room.value) {
      await room.value.leave();
    }
    reset();
  }

  function send(type: string, payload: any = {}) {
    if (!room.value) return;
    room.value.send(type, payload);
  }

  /**
   * INTERNALS
   */

  function setupRoomLifecycle() {
    if (!room.value) {
      console.warn("Trying to setup without room!");
      return;
    }

    room.value.onLeave((code) => {
      console.warn("Left room", code);
      reset();
    });

    room.value.onError((code, message) => {
      console.error("Room error:", code, message);
    });
  }

  function setupStateListeners() {
    if (!room.value) {
      console.warn("Trying to setup without room!");
      return;
    }

    const $ = getStateCallbacks(room.value);

    // LISTEN COLLECTION
    $(room.value.state).players.onAdd((player, id) => {
      players[id] = serializePlayer(player);

      // LISTEN FIELD CHANGE
      $(player).onChange(() => {
        players[id] = serializePlayer(player);
      });

      // CARDS CHANGE
      $(player).cards.onAdd((card, index) => {
        players[id].cards.splice(index, 0, card);
      });

      $(player).cards.onRemove((_, index) => {
        players[id].cards.splice(index, 1);
      });
    });

    $(room.value.state).players.onRemove((_, id) => {
      delete players[id];
    });

    $(room.value.state).onChange(() => {
      state.value = serializeState(room.value?.state);
    });

    // ex synchro valeur simple
    // $(room.value.state).listen("roundState", (value, previous) => {
    //   roundState.value = value;
    // });

    // ex synchro valeur complexe (objet)
    // $(room.value.state).listen("roundState", (current) => {
    //   if (!current) return;

    //   // sync initial
    //   Object.assign(roundState, serializeRound(current));

    //   // écouter les changements internes
    //   $(current).onChange(() => {
    //     Object.assign(roundState, serializeRound(current));
    //   });
    // });
  }

  /**
   * HELPERS
   */
  function serializePlayer(player: any): Player {
    return {
      sessionId: player.sessionId,
      name: player.name,
      lives: player.lives,
      cards: [],
      isHost: player.isHost,
      isReady: player.isReady,
      response: player.response,
    };
  }

  function serializeState(state: GameRoom): GameRoom {
    return {
      players: {}, // unused
      roundMasterId: state.roundMasterId,
      proposition: state.proposition,
      roundState: state.roundState,
    };
  }

  function reset() {
    room.value = undefined;
    sessionId.value = undefined;
    initialized.value = false;

    // clear reactive object safely
    Object.keys(players).forEach((k) => delete players[k]);
  }

  /**
   * EXPOSE
   */
  return {
    // State
    room,
    state,
    sessionId,
    initialized,
    players,
    me,

    // Actions
    createRoom,
    joinRoom,
    leave,
    send,
  };
});
