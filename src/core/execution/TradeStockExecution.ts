import { Execution, Game, Player } from "../game/Game";
import type { StockSymbol } from "../game/StockMarket";

export class TradeStockExecution implements Execution {
  private active = true;

  constructor(
    private readonly player: Player,
    private readonly symbol: StockSymbol,
    private readonly shares: number,
    private readonly buy: boolean,
  ) {}

  init(_game: Game, _ticks: number): void {}

  tick(_ticks: number): void {
    this.player.tradeStock(this.symbol, this.shares, this.buy);
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}