import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EventBus } from "../../../core/EventBus";
import { GameView } from "../../view";
import { SendPurchaseSatelliteIntentEvent } from "../../Transport";
import { Controller } from "../../Controller";

@customElement("fog-city-overlay")
export class FogCityOverlay extends LitElement implements Controller {
  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: block;
      background: #10151a;
      color: #e9f1f2;
      font-family: Georgia, serif;
    }
    .panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      max-width: 28rem;
      padding: 2rem;
      border: 1px solid #60747a;
      background: #182126;
    }
    h1 { margin: 0 0 .5rem; font-size: 2rem; }
    p { color: #b6c5c8; }
    button {
      border: 0;
      padding: .8rem 1.1rem;
      background: #d7a945;
      color: #16110a;
      font: inherit;
      font-weight: bold;
      cursor: pointer;
    }
    button:disabled { cursor: not-allowed; opacity: .5; }
  `;

  public game!: GameView;
  public eventBus!: EventBus;
  @state() private visible = false;
  @state() private canBuy = false;

  tick(): void {
    const player = this.game.myPlayer();
    const fogCity =
      this.game.config().gameConfig().isFogCity ?? false;
    this.visible = fogCity && player !== null && !player.state.hasSatellite;
    this.canBuy = (player?.gold() ?? 0n) >= 70_000_000n;
  }

  private buy(): void {
    this.eventBus.emit(new SendPurchaseSatelliteIntentEvent());
  }

  render() {
    if (!this.visible) return html``;
    return html`
      <div class="panel">
        <h1>Fog City</h1>
        <p>The city is hidden in the fog. Deploy a satellite to reveal it.</p>
        <button ?disabled=${!this.canBuy} @click=${this.buy}>
          Buy satellite: 70,000,000 gold
        </button>
      </div>
    `;
  }
}