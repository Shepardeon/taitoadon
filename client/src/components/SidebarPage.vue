<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center">
      <!-- Page content here -->
      <nav class="navbar w-full bg-base-300">
        <label for="my-drawer-3" class="btn drawer-button lg:hidden">
          <FontAwesomeIcon :icon="faBars" />
        </label>
        <slot name="nav"></slot>
      </nav>
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-3"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="menu bg-base-200 min-h-full w-80 p-4 justify-between">
        <!-- Sidebar content here -->
        <slot name="side"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
</script>
