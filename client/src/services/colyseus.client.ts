import { Client } from "@colyseus/sdk";

let client: Client | null = null;
const clientUrl = import.meta.env.PROD
  ? `${location.protocol}//${location.hostname}/api`
  : `${location.protocol}//${location.hostname}:2567`;

export function getClient() {
  if (!client) {
    client = new Client(clientUrl);
  }

  return client;
}
