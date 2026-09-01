import { Execution, Game, Player } from "../game/Game";
import { tradeNationStock } from "../game/NationStockMarket";

export class InvestNationExecution implements Execution {
  private active = true;
  private game!: Game;

  constructor(
    private readonly player: Player,
    private readonly targetID: string,
    private readonly shares: number,
    private readonly buy: boolean,
  ) { }

  init(game: Game, _ticks: number): void {
    this.game = game;
  }

  tick(_ticks: number): void {
    tradeNationStock(this.player, this.game, this.targetID, this.shares, this.buy);
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
