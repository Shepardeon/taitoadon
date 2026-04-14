import { propositions, responses } from "../data/cards";
import { Deck } from "../data/deck";

export class CardServices {
  private _propositons = new Deck(propositions);
  private _responses = new Deck(responses);

  public getRandomProposition(): string {
    return this._propositons.draw(1)[0];
  }

  public getRandomResponses(n: number): Array<string> {
    return this._responses.draw(n);
  }
}
