import { Execution, Game, Player } from "../game/Game";

export const SATELLITE_COST = 70_000_000n;

export class PurchaseSatelliteExecution implements Execution {
  private active = true;

  constructor(private readonly player: Player) {}

  init(_game: Game, _ticks: number): void {}

  tick(_ticks: number): void {
    this.player.purchaseSatellite();
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }
}