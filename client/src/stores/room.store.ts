import { getStateCallbacks, Room } from "@colyseus/sdk";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Player } from "../models/game.model";
import { getClient } from "../services/colyseus.client";

export const useRoomStore = defineStore("room", () => {
  /**
   * STATE
   */
  const room = ref<Room>();
  const sessionId = ref<string>();
  const initialized = ref(false);

  const players = reactive<{ [sessionId: string]: Player }>({});

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
    sessionId,
    initialized,
    players,

    // Actions
    createRoom,
    joinRoom,
    leave,
    send,
  };
});
