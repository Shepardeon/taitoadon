<template>Room: {{ room?.roomId }}</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useRoomStore } from "../stores/room.store";

const { room } = storeToRefs(useRoomStore());
</script>
