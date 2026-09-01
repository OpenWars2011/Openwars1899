import { describe, expect, it } from "vitest";
import { deriveServerWsBase } from "../../src/client/ClientEnv";

// deriveServerWsBase resolves the game-server WebSocket origin used by both the
// public-lobby socket (LobbySocket) and the in-game socket (Transport).
//
// The web build injects no serverHost, so it must keep the historical
// same-origin behaviour (derive scheme + host from window.location). The
// desktop app loads from app://OpenWars — where location.host is not a real
// server — and injects an EXPLICIT game-server host (the host is branch-variable
// on dev and not derivable from the API audience), which is targeted over TLS.
describe("deriveServerWsBase", () => {
  describe("web build (no injected serverHost) is unchanged", () => {
    it("uses same-origin wss on https", () => {
      expect(deriveServerWsBase(undefined, "https:", "OpenWars.io")).toBe(
        "wss://OpenWars.io",
      );
    });

    it("uses same-origin ws on http (local dev falls back to location.host)", () => {
      expect(deriveServerWsBase(undefined, "http:", "localhost:3000")).toBe(
        "ws://localhost:3000",
      );
    });

    it("preserves the exact location.host (e.g. www vs apex)", () => {
      expect(deriveServerWsBase(undefined, "https:", "www.OpenWars.io")).toBe(
        "wss://www.OpenWars.io",
      );
    });

    it("treats an empty serverHost as absent (web fallback)", () => {
      expect(deriveServerWsBase("", "https:", "OpenWars.io")).toBe(
        "wss://OpenWars.io",
      );
    });
  });

  describe("desktop build (explicit serverHost) targets the real game server", () => {
    it("targets the packaged prod host over wss", () => {
      expect(deriveServerWsBase("OpenWars.io", "app:", "openfront")).toBe(
        "wss://OpenWars.io",
      );
    });

    it("targets the dev default host over wss", () => {
      expect(
        deriveServerWsBase("main.OpenWars.dev", "app:", "openfront"),
      ).toBe("wss://main.OpenWars.dev");
    });

    it("targets a branch-specific subdomain over wss", () => {
      expect(
        deriveServerWsBase("my-feature.OpenWars.dev", "app:", "openfront"),
      ).toBe("wss://my-feature.OpenWars.dev");
    });

    it("ignores location entirely when a serverHost is configured", () => {
      // Even under http/https, an explicit host wins — the desktop origin
      // (app:) must never fall through to window.location.host.
      expect(deriveServerWsBase("OpenWars.io", "https:", "openfront")).toBe(
        "wss://OpenWars.io",
      );
    });
  });
});
