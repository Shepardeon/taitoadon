import { Client, Room } from "@colyseus/sdk";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GameRoom } from "../models/game.model";

export const useRoomStore = defineStore("room", () => {
  const client = new Client(`${location.protocol}//${location.hostname}:2567`);
  const room = ref<Room<GameRoom>>();
  const state = ref<GameRoom>();

  const isConnected = computed(() => room.value != undefined);
  const roomId = computed(() => room.value?.roomId);

  const setupRoom = (r: Room<GameRoom>) => {
    room.value = r;

    r.onStateChange((newState) => {
      state.value = newState;
    });
  };

  const createRoomAsync = async (username: string) => {
    const r = await client.create("game_room", { username });
    setupRoom(r);
  };

  const joinRoomAsync = async (roomId: string, username: string) => {
    const r = await client.joinById(roomId, { username });
    setupRoom(r);
  };

  const leaveRoom = () => {
    room.value?.leave();
    room.value = undefined;
    state.value = undefined;
  };

  const send = (messageType: string, payload?: any) => {
    console.log("sending...");
    room.value?.send(messageType, payload);
    console.log("sent");
  };

  return {
    createRoomAsync,
    joinRoomAsync,
    leaveRoom,
    send,
    isConnected,
    roomId,
    state,
  };
});
