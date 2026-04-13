import { ref } from "vue";

export function useSpeech() {
  if (!("speechSynthesis" in window)) {
    console.error("speechSynthesis is not supported on your browser");
    throw new Error("Usupported speech synthesis!");
  }

  const utterance = ref<SpeechSynthesisUtterance>();

  const frenchVoices = speechSynthesis
    .getVoices()
    .filter((s) => s.lang === "fr-FR");

  const sayWithRandomVoice = (text: string, onComplete?: () => void) => {
    utterance.value = new SpeechSynthesisUtterance(text);
    utterance.value.voice =
      frenchVoices[Math.floor(Math.random() * frenchVoices.length)];

    if (onComplete) {
      utterance.value.onend = onComplete;
    }

    speechSynthesis.speak(utterance.value);
  };

  const cancelUtterance = () => {
    if (utterance.value) {
      speechSynthesis.cancel();
      utterance.value = undefined;
    }
  };

  return {
    sayWithRandomVoice,
    cancelUtterance,
  };
}
