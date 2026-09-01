import { Game, Player, PlayerType } from "./Game";

// Fake stocks backed by nations: each living nation acts like a company
// whose share price depends on its size (tiles owned).
const BASE_NATION_PRICE = 50_000;

export function nationSharePrice(ticks: number, target: Player): bigint {
  if (target.type() !== PlayerType.Nation) return 0n;
  const tiles = Math.max(1, target.numTilesOwned());
  // price grows sub-linearly with territory and oscillates a bit per tick
  const wave = 1 + 0.15 * Math.sin(ticks / 240 + Number(target.id()) || 0);
  const value = BASE_NATION_PRICE * Math.sqrt(tiles) * wave;
  return BigInt(Math.max(10_000, Math.round(value)));
}

export function tradeNationStock(
  buyer: Player,
  game: Game,
  targetID: string,
  shares: number,
  buy: boolean,
): boolean {
  if (!Number.isInteger(shares) || shares <= 0 || shares > 1000) return false;
  let t: Player | undefined;
  for (const p of game.players()) {
    if (p.id() === targetID) {
      t = p;
      break;
    }
  }
  if (t === undefined || t.type() !== PlayerType.Nation) return false;
  const price = nationSharePrice(game.ticks(), t);
  if (price === 0n) return false;

  // holdings stored on the trading player under a pseudo symbol
  const key = `nation:${t.id()}` as never;
  const holdings = (buyer as unknown as { _stockHoldings: Record<string, number> })._stockHoldings;
  const held = holdings[key] ?? 0;
  if (buy) {
    const total = price * BigInt(shares);
    if (buyer.gold() < total) return false;
    buyer.removeGold(total);
    holdings[key] = held + shares;
    return true;
  }
  if (held < shares) return false;
  buyer.addGold(price * BigInt(shares));
  const remaining = held - shares;
  if (remaining === 0) delete holdings[key];
  else holdings[key] = remaining;
  return true;
}
