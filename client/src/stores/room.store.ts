import { Client, Room } from "@colyseus/sdk";
import { defineStore } from "pinia";
import { ref } from "vue";
import { GameRoom } from "../models/game.model";

export const useRoomStore = defineStore("room", () => {
  const client = new Client(`${location.protocol}//${location.hostname}:2567`);
  const room = ref<Room<GameRoom>>();

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

  return {
    createRoomAsync,
    joinRoomAsync,
    room,
  };
});
