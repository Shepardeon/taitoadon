import { Client } from "@colyseus/sdk";

let client: Client | null = null;

export function getClient() {
  if (!client) {
    client = new Client(`${location.protocol}//${location.hostname}:2567`);
  }

  return client;
}
