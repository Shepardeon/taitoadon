import { propositions, responses } from "../data/cards";

export class CardServices {
  propositons = propositions;
  responses = responses;

  public getRandomProposition(): string {
    return propositions[Math.floor(Math.random() * propositions.length)];
  }

  public getRandomResponses(n: number): Array<string> {
    const shuffled = Array.from(responses).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
}
