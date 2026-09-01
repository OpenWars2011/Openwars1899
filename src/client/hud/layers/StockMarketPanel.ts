import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EventBus } from "../../../core/EventBus";
import { STOCK_SYMBOLS, stockPrice } from "../../../core/game/StockMarket";
import { Controller } from "../../Controller";
import { SendTradeStockIntentEvent, SendInvestNationIntentEvent } from "../../Transport";
import { GameView } from "../../view";

@customElement("stock-market-panel")
export class StockMarketPanel extends LitElement implements Controller {
  static styles = css`
    :host { position: fixed; right: 1rem; bottom: 1rem; z-index: 1000; color: white; font: 14px sans-serif; }
    .panel { background: #17232a; border: 1px solid #60747a; padding: .75rem; width: 15rem; }
    h2 { font: bold 1rem Georgia, serif; margin: 0 0 .5rem; }
    .row { display: grid; grid-template-columns: 1fr auto auto; gap: .35rem; align-items: center; margin: .3rem 0; }
    button { border: 0; padding: .25rem .4rem; cursor: pointer; }
    .buy { background: #88c98a; } .sell { background: #e4a08b; }
    small { color: #b6c5c8; }
  `;

  public game!: GameView;
  public eventBus!: EventBus;
  @state() private tickCount = 0;

  tick(): void { this.tickCount = this.game.ticks(); }

  private trade(symbol: string, buy: boolean): void {
    this.eventBus.emit(new SendTradeStockIntentEvent(symbol, 1, buy));
  }

  render() {
    const player = this.game.myPlayer();
    if (!player) return html``;
    const nations = this.game
      .players()
      .filter((p) => p.isPlayer() && p.type() === "NATION" && p.isAlive());
    return html`<div class="panel">
      <h2>Country Exchange</h2>
      ${STOCK_SYMBOLS.map((symbol) => {
        const held = player.state.stockHoldings?.[symbol] ?? 0;
        const price = stockPrice(this.tickCount, symbol);
        return html`<div class="row"><span>${symbol}<br /><small>${price} gold | ${held} held</small></span>
          <button class="buy" @click=${() => this.trade(symbol, true)}>Buy</button>
          <button class="sell" ?disabled=${held === 0} @click=${() => this.trade(symbol, false)}>Sell</button>
        </div>`;
      })}
      <h2>Nation Stocks</h2>
      <small>Invest gold in countries - their value grows with territory</small>
      ${nations.map(
        (nation) => html`<div class="row">
          <span>${nation.name()}<br /><small>${nation.numTilesOwned()} tiles</small></span>
          <button class="buy" @click=${() => this.eventBus.emit(new SendInvestNationIntentEvent(nation.id(), 1, true))}>Buy</button>
          <button class="sell" @click=${() => this.eventBus.emit(new SendInvestNationIntentEvent(nation.id(), 1, false))}>Sell</button>
        </div>`,
      )}
    </div>`;
  }
}