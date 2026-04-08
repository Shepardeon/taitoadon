import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { Client, Room } from "colyseus";

export class Player extends Schema {
  @type("string") public sessionId: string;
  @type("string") public name: string;
  @type("int8") public lives: number;
  @type({ array: String }) public cards = new ArraySchema<string>();
}

export class GameRoomState extends Schema {
  @type({ map: Player }) public players = new MapSchema<Player>();
  @type("string") public roundMasterId: string;
  @type("string") public proposition: string;
  @type("string") public roundState:
    | "waiting_for_players"
    | "propose_phase"
    | "choice_phase";
}

export class GameRoom extends Room {
  maxClients = 20;
  state = new GameRoomState();

  onCreate(options: any): void | Promise<any> {
    this.state.roundState = "waiting_for_players";
  }

  onJoin(client: Client<any>, options?: any, auth?: any): void | Promise<any> {
    console.log(`${options.username}(${client.sessionId}) joined!`);

    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options.username;
    player.lives = 3;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client<any>, code?: number): void | Promise<any> {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose(): void | Promise<any> {
    console.log("room", this.roomId, "disposing...");
  }
}
