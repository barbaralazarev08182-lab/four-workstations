---
name: game-economy-design
description: |
  Game economy design for four-workstations. Use when adding currency,
  shops, inventory, purchases, funds, rewards, or any value-transfer system.
---

# Game Economy Design

## Core concepts

- **工票 (Work Ticket)** — personal currency earned passively
- **公共基金 (Public Fund)** — shared office pool
- **商店 (Shop)** — curated item catalog
- **库存 (Inventory)** — per-user owned items
- **家具摆放 (Furniture Placement)** — place/recall items in office

## Design rules

### Earnings

- Personal 工票 are earned through time spent in active statuses (clockedIn, working, studying, busy, overtime).
- **Daily earning cap**: hard limit per 24h per user. Excess time does not roll over.
- **Cooldown**: repeated identical actions within a window grant diminishing or zero reward.
- **No**: workplace ranking, leaderboard, or "most diligent" metric that undermines the relaxed four-person dynamic.

### Spending

- Shop items have fixed price tiers. No dynamic pricing, no auctions.
- Changfen supplies (food, toys, accessories) are a distinct category with lower prices.
- Scene unlocks require a one-time public fund threshold.

### Transactions

- Every transaction is an **idempotent event** identified by a unique event ID.
- **Server-authoritative**: the client submits intent; the server validates balance, caps, cooldowns.
- Concurrent purchases on the same item must resolve to exactly one winner.
- Failed transactions must roll back cleanly — no partial state.
- A refund pathway exists for accidental purchases within a short window.

### Anti-abuse

- **FORBIDDEN**:
  - Direct "work hours → massive currency" conversion
  - Client-submitted reward amounts
  - Infinite repeat farming without cooldown
  - High-volatility gambling-like returns
  - Paid loot boxes or induced spending
  - "Most hardworking" leaderboards

### Public Fund

- A small percentage of each 工票 earning goes to the office public fund.
- Public fund unlocks shared assets: new scenes (棋牌室, 咖啡室), shared furniture, office decorations.
- Fund balance and unlock progress are visible to all members.

### 棋牌室 (Card Room)

- Entry costs a token amount from personal 工票.
- Small fixed rewards for participation (time-limited, capped).
- No real gambling mechanics. Pure social activity with token incentives.

## Future table & RPC drafts

```
tables:
  user_wallets        (user_id, balance, last_earn_at, daily_earned)
  transaction_ledger  (id, user_id, type, amount, event_id, created_at)
  shop_items          (id, name, category, price, stock_type)
  user_inventory      (user_id, item_id, quantity, acquired_at)
  office_fund         (office_id, balance)
  scene_unlocks       (office_id, scene_key, unlocked_at)
  furniture_placement (office_id, user_id, item_id, position, rotation)

rpcs:
  earn_ticket(event_id) → balance
  purchase_item(event_id, item_id) → inventory
  place_furniture(event_id, item_id, position) → placement
  recall_furniture(event_id, placement_id) → inventory
  donate_to_fund(event_id, amount) → fund_balance
  unlock_scene(event_id, scene_key) → unlock
```

## Server-authoritative flows

All currency operations go through RPC functions. The client never writes to balance or inventory tables directly.

- **earn_ticket**: client submits `{event_id}` only; server calculates amount from online duration and status
- **purchase_item**: client submits `{event_id, item_id}`; server validates balance, caps, stock
- **Concurrent purchases**: `SELECT ... FOR UPDATE` or `pg_advisory_xact_lock` to prevent overselling
- **Idempotency**: every event has a unique `event_id`; duplicate submissions return the first result

## Anti-abuse rules

| Attack | Defense |
|--------|---------|
| Multi-tab duplicate earn | event_id idempotency + server time window check |
| Script high-frequency earn | Server rate limit: max 1 earn call per user per minute |
| Fake status switching | Status must have minimum duration (e.g. working ≥5 min) |
| Concurrent purchase exploit | Row-level lock + advisory lock |
| Negative amount injection | RPC parameter validation + CHECK constraints |
| Public fund overspend | Atomic operation + balance pre-check |

## V1 explicit scope

- **IN**: 工票 passive earning, daily cap, simple shop, inventory, 肠粉 supplies, public fund
- **OUT**: 棋牌室 full economy, scene unlocking, furniture placement UI, complex pricing tiers
