import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { AuthContext, Client, Room } from "colyseus";
import { CardServices } from "../services/card.service";

export class Player extends Schema {
  @type("string") public sessionId: string;
  @type("string") public name: string;
  @type("int8") public lives: number;
  @type(["string"]) public cards = new ArraySchema<string>();
  @type("boolean") public isHost: boolean;
  @type("boolean") public isReady: boolean;
  @type("string") public response: string;
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
  cardService = new CardServices();

  messages = {
    start: (_client: Client, _paylod: any) => {
      if (this.state.roundState !== "waiting_for_players") return;

      this.state.proposition = this.cardService.getRandomProposition();
      this.state.roundState = "propose_phase";

      this.state.players.forEach((player) => {
        player.cards.clear();
        player.cards.push(...this.cardService.getRandomResponses(4));
        player.isReady = false;
      });

      const randomPlayer = this.state.players["~getByIndex"](
        Math.floor(Math.random() * this.state.players.size),
      );

      this.state.roundMasterId = randomPlayer.sessionId;
      randomPlayer.isReady = true;
    },

    respond: (client: Client, payload: any) => {
      if (this.state.roundState !== "propose_phase") return;

      const player = this.state.players.get(client.sessionId);
      player.response = payload.response;
      player.isReady = true;

      for (let [_, arrPlayer] of this.state.players) {
        if (!arrPlayer.isReady) return;
      }

      this.state.roundState = "choice_phase";
    },

    choose: (_client: Client, payload: any) => {
      if (this.state.roundState !== "choice_phase") return;

      const looser = this.state.players.get(payload.sessionId);
      looser.lives--;

      if (looser.lives <= 0) {
        this.state.roundState = "waiting_for_players";
        return;
      }

      this.state.players.forEach((player) => (player.isReady = false));
      looser.isReady = true;

      this.state.roundMasterId = looser.sessionId;
      this.state.proposition = this.cardService.getRandomProposition();
      this.state.roundState = "propose_phase";
    },

    requestCards: (client: Client, _payload: any) => {
      const player = this.state.players.get(client.sessionId);
      player.cards.clear();
      player.cards.push(...this.cardService.getRandomResponses(4));
    },
  };

  onCreate(options: any): void | Promise<any> {
    this.state.roundState = "waiting_for_players";
  }

  onJoin(client: Client<any>, options?: any, auth?: any): void | Promise<any> {
    console.log(`${options.username}(${client.sessionId}) joined!`);

    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options.username;
    player.lives = 3;
    player.isHost = this.state.players.size === 0;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client<any>, code?: number): void | Promise<any> {
    const player = this.state.players.get(client.sessionId);
    this.state.players.delete(player.sessionId);

    if (player.isHost && this.state.players.size) {
      this.state.players["~getByIndex"](0).isHost = true;
    }

    console.log(`${player.name}(${client.sessionId}) left!`);
  }

  onDispose(): void | Promise<any> {
    console.log("room", this.roomId, "disposing...");
  }

  onAuth(client: Client, options: any, context: AuthContext) {
    return this.state.roundState === "waiting_for_players";
  }
}
