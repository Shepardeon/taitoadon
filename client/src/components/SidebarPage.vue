<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <slot></slot>
      <label for="my-drawer-3" class="btn drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <div class="menu bg-base-200 min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <slot name="side"></slot>
      </div>
    </div>
  </div>
</template>
