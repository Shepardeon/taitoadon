import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref<string>();
  const isLogged = computed(() => username.value !== undefined);

  const login = (name: string) => (username.value = name);
  const logout = () => (username.value = undefined);

  return {
    login,
    logout,
    username,
    isLogged,
  };
});
