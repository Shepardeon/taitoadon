export class Deck<T> {
  private _available: T[] = [];
  private _drawn: T[] = [];

  constructor(cards: T[]) {
    this._available = [...cards];
    this._shuffle();
  }

  public draw(n: number) {
    const drawn: T[] = [];

    for (let i = 0; i < n; i++) {
      if (this._available.length <= 0) {
        this._shuffle();
      }

      const card = this._available.pop();
      this._drawn.push(card);
      drawn.push(card);
    }

    return drawn;
  }

  private _shuffle() {
    this._available = [...this._drawn, ...this._available].sort(
      () => 0.5 - Math.random(),
    );
  }
}
