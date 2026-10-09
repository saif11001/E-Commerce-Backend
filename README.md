# Venerdi — E-Commerce API

REST API for the Venerdi fashion store. Built with Node.js, Express 5 and MongoDB.

## Features
- Auth: signup, email verification (6-digit code), login, logout, forgot/reset password
- JWT access + refresh tokens in httpOnly cookies, refresh-token rotation stored in Redis
- Guest cart (cookie based) that merges into the user cart on login
- Products, categories, coupons, shipping zones (per governorate)
- Checkout with Cash on Delivery or Stripe (PaymentIntents + webhook, idempotent order creation)
- Atomic stock reservation with rollback
- Order tracking for guests via emailed link
- Role based admin panel API (admin / manager / support) with analytics
- Rate limiting, Helmet, request validation (express-validator)

## Architecture
`routes → controllers → services → repositories → models`

## Getting started
```bash
cp .env.example .env   # fill in the values
npm install
npm run dev            # http://localhost:7000
```

Health check: `GET /health`

## Stripe webhook (local)
```bash
stripe listen --forward-to localhost:7000/api/v1/webhook/stripe
```
Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`.

## Deployment notes
- Deployed on Render (free tier sleeps after ~15 min idle, first request can take 30–60 s).
- The frontend proxies `/api/v1/*` to this service, so cookies are first-party (needed for Safari/iOS).
  Because of that proxy, `trust proxy` is set to `2`.
- Set `NODE_ENV=production` and `CLIENT_URL` to the exact frontend origin (no trailing slash).

## Related repositories
- Frontend (Next.js)
- Chat server (Socket.IO)