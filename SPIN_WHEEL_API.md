# Spin Wheel Discount System

## Run

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:backend
```

## Required Env

Add these to `.env.local`:

```env
NEXT_PUBLIC_SPIN_API_BASE_URL=https://tissuepower.com/api
NEXT_PUBLIC_SPIN_USER_STORAGE_KEY=magic-tissue-spin-user-id
SPIN_SERVER_PORT=4000
```

## Frontend Flow

1. Client creates a local `spin-user-*` id and stores it in browser local storage.
2. Spin popup appears only when:
   - popup is enabled
   - user has not spun before
   - probability check passes
   - delay window is reached
3. User spins once.
4. Backend stores reward in `UserSpin`.
5. Checkout sends package selection to Express backend.
6. Backend validates package price and discount before creating order.
7. Consumed discount is attached to order and marked used in `UserSpin`.

## Express APIs

### `GET /health`
Returns backend health.

### `GET /api/spin/config`
Public wheel config:

```json
{
  "popupEnabled": true,
  "minDelaySeconds": 5,
  "maxDelaySeconds": 20,
  "showProbability": 0.5,
  "exitIntentEnabled": true,
  "sideImageUrl": "",
  "popupTitle": "Spin the wheel for a surprise discount",
  "popupSubtitle": "Try your luck once and unlock a verified reward for checkout.",
  "popupButtonText": "Spin Now",
  "options": []
}
```

### `GET /api/spin/me`
Protected with `Authorization: Bearer spin-user-*` token.

Response:

```json
{
  "hasSpun": true,
  "used": false,
  "reward": {
    "label": "10% OFF",
    "type": "percentage",
    "value": 10
  }
}
```

### `POST /api/spin`
Protected with `Authorization: Bearer spin-user-*` token.

Returns selected reward:

```json
{
  "spinId": "mongo-id",
  "reward": {
    "id": "option-id",
    "label": "50 TK OFF",
    "type": "fixed",
    "value": 50
  }
}
```

### `POST /api/orders`
Protected with `Authorization: Bearer spin-user-*` token.

Request:

```json
{
  "name": "Customer",
  "phone": "01700000000",
  "city": "Dhaka",
  "address": "Full address",
  "productLabel": "Magic Tissue",
  "packageId": "single-pack",
  "quantity": 1,
  "paymentMethod": "COD"
}
```

Response:

```json
{
  "orderId": "mongo-id",
  "totalPrice": 224,
  "discount": {
    "type": "percentage",
    "value": 10,
    "amount": 25,
    "label": "10% OFF",
    "spinId": "spin-id"
  }
}
```

## Next Admin APIs

These use the existing admin session auth already present in this project.

### `GET/POST /api/admin/spin-options`
Create and list wheel rewards.

### `PATCH/DELETE /api/admin/spin-options/[id]`
Update or remove a reward.

### `GET/PATCH /api/admin/spin-config`
Read and update popup settings, side image, probability, delays, and forced result.

### `GET /api/admin/spin-analytics`
Returns:

```json
{
  "totalSpins": 0,
  "consumedSpins": 0,
  "availableSpins": 0,
  "rewardedOrders": 0,
  "rewardBreakdown": [],
  "recentSpins": []
}
```
