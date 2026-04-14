<template>
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" value="dark" />

    <FontAwesomeIcon class="swap-off text-2xl fill-current" :icon="faSun" />

    <FontAwesomeIcon class="swap-on text-2xl fill-current" :icon="faMoon" />
  </label>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
</script>
