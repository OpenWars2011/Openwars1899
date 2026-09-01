import { Execution, Game, Gold, Player } from "../game/Game";
import { toInt } from "../Util";

export class PurchaseGoldExecution implements Execution {
  private active = true;
  private readonly gold: Gold;

  constructor(private readonly player: Player, gold: number) {
    this.gold = toInt(gold);
  }

  init(_mg: Game, _ticks: number): void {}

  tick(): void {
    this.player.addGold(this.gold);
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }
}