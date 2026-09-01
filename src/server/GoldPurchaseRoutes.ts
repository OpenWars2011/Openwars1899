import express, { Request, Response } from "express";
import Stripe from "stripe";
import { ID } from "../core/Schemas";
import { GameManager } from "./GameManager";
import { verifyClientToken } from "./jwt";

export const PURCHASED_GOLD = 50_000_000;
export const GOLD_PURCHASE_PRICE_CENTS = 50;

const fulfilledEvents = new Set<string>();

function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export function registerGoldPurchaseRoutes(
  app: express.Express,
  gm: GameManager,
): void {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req: Request, res: Response) => {
      const stripe = stripeClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const signature = req.headers["stripe-signature"];
      if (!stripe || !webhookSecret || typeof signature !== "string") {
        return res.status(503).send("Stripe webhook is not configured");
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      } catch {
        return res.status(400).send("Invalid Stripe signature");
      }
      if (fulfilledEvents.has(event.id)) return res.json({ received: true });

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== "paid") {
          return res.json({ received: true });
        }
        const gameID = ID.safeParse(session.metadata?.gameID);
        const persistentID = session.metadata?.persistentID;
        if (!gameID.success || !persistentID) {
          return res.status(400).send("Invalid purchase metadata");
        }
        const game = gm.game(gameID.data);
        if (game === null) {
          return res.status(409).send("Game is no longer available");
        }
        const result = game.grantPurchasedGold(persistentID, PURCHASED_GOLD);
        if (result === "not_found") {
          return res.status(409).send("Player is no longer in this game");
        }
        if (result === "not_playing") {
          return res.status(409).send("Spectators cannot buy game gold");
        }
        fulfilledEvents.add(event.id);
      }
      return res.json({ received: true });
    },
  );

  app.post("/api/stripe/create-game-gold-checkout", async (req, res) => {
    const stripe = stripeClient();
    if (!stripe) return res.status(503).json({ error: "Stripe unavailable" });
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization required" });
    }
    const auth = await verifyClientToken(authHeader.substring("Bearer ".length));
    if (auth.type !== "success") return res.status(401).json({ error: "Invalid token" });

    const parsed = ID.safeParse(req.body?.gameID);
    const hostname = req.body?.hostname;
    if (!parsed.success || typeof hostname !== "string" || !/^https?:\/\//.test(hostname)) {
      return res.status(400).json({ error: "Invalid game or hostname" });
    }
    const game = gm.game(parsed.data);
    if (game === null || !game.hasStarted()) {
      return res.status(409).json({ error: "Game is not active" });
    }
    if (game.getClientIdForPersistentId(auth.persistentId) === null) {
      return res.status(403).json({ error: "Player is not in this game" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: { name: "50,000,000 game gold" },
            unit_amount: GOLD_PURCHASE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: { gameID: parsed.data, persistentID: auth.persistentId },
      success_url: `${hostname}/#purchase-completed?status=true&type=game_gold`,
      cancel_url: `${hostname}/#purchase-completed?status=false&type=game_gold`,
    });
    return res.json({ url: session.url });
  });
}