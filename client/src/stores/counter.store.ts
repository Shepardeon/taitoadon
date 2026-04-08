import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const counter = ref(0);

  const increase = () => counter.value++;
  const decrease = () => counter.value--;
  const reset = () => (counter.value = 0);

  return {
    counter,
    increase,
    decrease,
    reset,
  };
});
