import { Client, Room } from "@colyseus/sdk";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GameRoom } from "../models/game.model";

export const useRoomStore = defineStore("room", () => {
  const client = new Client(`${location.protocol}//${location.hostname}:2567`);
  const room = ref<Room<GameRoom>>();
  const isConnected = computed(() => room.value != undefined);

  const createRoomAsync = async (username: string) => {
    room.value = await client.create("game_room", {
      username,
    });
  };

  const joinRoomAsync = async (roomId: string, username: string) => {
    room.value = await client.joinById(roomId, {
      username,
    });
  };

  const leaveRoom = () => {
    if (isConnected.value) {
      room.value?.leave();
      room.value = undefined;
    }
  };

  return {
    createRoomAsync,
    joinRoomAsync,
    leaveRoom,
    isConnected,
    room,
  };
});
