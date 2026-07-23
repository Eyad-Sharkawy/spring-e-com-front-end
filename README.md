# Spring E-com (Frontend)

Angular single-page application for **Spring E-com**, a full-stack e-commerce demo. The UI lets shoppers browse products, manage a cart, and complete checkout. Sellers can add and edit products through the same app.

This repo is the frontend companion to the [Spring Boot backend](https://github.com/Eyad-Sharkawy/spring-e-com-back-end) REST API.

## Live demo

| App | URL |
| --- | --- |
| Frontend (Vercel) | [https://spring-e-com.vercel.app](https://spring-e-com.vercel.app/) |
| Backend API | [https://spring-e-com.duckdns.org](https://spring-e-com.duckdns.org/) |

## Features

- **Catalog** — browse products with server-side sorting (name, price, stock, date) and persistent sorting settings saved in local storage
- **Product details** — view a single product and add it to the cart
- **Cart** — update quantities, remove items, sort line items with persistent sorting settings, and see running totals
- **Checkout** — place an order and view an order confirmation page
- **Product management** — create new products and edit existing ones

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Angular 22](https://angular.dev) (standalone components, signals) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| HTTP / state | RxJS, Angular `@Service()` with facade pattern |
| Testing | [Vitest](https://vitest.dev/) via `@angular/build:unit-test` |
| Language | TypeScript 6 |

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- The **Spring Boot backend** running locally on port `8080`, or access to the deployed API

The backend expects a PostgreSQL database configured through environment variables. See the [backend repository](https://github.com/Eyad-Sharkawy/spring-e-com-back-end) for setup details.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend

Clone and run the [backend repository](https://github.com/Eyad-Sharkawy/spring-e-com-back-end) locally so the API is available at:

```
http://localhost:8080/api
```

CORS is configured to allow requests from `http://localhost:4200` by default.

### 3. Run the dev server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app reloads automatically when source files change.

## Configuration

API URLs are defined in the environment files:

| File | `apiUrl` | Used when |
| --- | --- | --- |
| `src/environments/environment.development.ts` | `http://localhost:8080/api` | `ng serve` (development) |
| `src/environments/environment.ts` | `https://spring-e-com.duckdns.org/api` | production builds |

The active environment is injected through the `ENVIRONMENT` token (`src/app/core/tokens/environment.token.ts`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server (`ng serve`) |
| `npm run build` | Production build (output in `dist/`) |
| `npm run watch` | Development build with file watching |
| `npm test` | Run unit tests with Vitest |

## Routes

| Path | Page |
| --- | --- |
| `/catalog` | Product catalog (default landing page) |
| `/product/:id` | Product detail |
| `/product/:id/edit` | Edit product |
| `/add-product` | Create product |
| `/cart` | Shopping cart |
| `/order-confirmation/:id` | Order confirmation |

## Project structure

```
src/app/
├── core/
│   ├── layout/          # Shell, header, footer
│   ├── models/          # Product, cart, and order TypeScript interfaces
│   ├── services/        # API clients and facades (products, cart, checkout)
│   └── tokens/          # Environment and LOCAL_STORAGE injection tokens
├── features/
│   ├── catalog/         # Product listing
│   ├── product/         # Product detail
│   ├── add-product/     # Create product form
│   ├── edit-product/    # Edit product form
│   ├── cart/            # Cart and checkout
│   └── order-confirmation/
└── shared/
    └── components/      # Reusable loading spinner and error UI
```

### Architecture notes

- **API layer** (`*/api/*-api.ts`) — thin HTTP clients that call the backend REST endpoints.
- **Facade layer** (`*/facade/*-facade.ts`) — holds UI state with Angular signals, handles loading/error states, and coordinates API calls.
- **Tokens** (`core/tokens/`) — environment and browser global dependency tokens. Includes a `LOCAL_STORAGE` injection token that wraps `window.localStorage` with a mock in-memory fallback for testing or SSR environments.
- **Layout shell** — wraps every page with a shared header and footer.

### Backend API endpoints consumed

| Resource | Base path |
| --- | --- |
| Products | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| Cart | `GET/POST/PUT/DELETE /api/carts/:cartId/...` |
| Checkout | `POST /api/checkout/:cartId` |

The cart uses a fixed demo cart ID defined in `CartFacade` (`CART_ID`).

## Code style

- Component selector prefix: `ec-`
- Prettier config: `.prettierrc`
- Editor defaults: `.editorconfig`

## Related projects

- **Backend (GitHub)** — [Eyad-Sharkawy/spring-e-com-back-end](https://github.com/Eyad-Sharkawy/spring-e-com-back-end) — Spring Boot 4, Java 21, Spring Data JPA, PostgreSQL
- **Backend (live)** — [spring-e-com.duckdns.org](https://spring-e-com.duckdns.org/)
- **Frontend (live)** — [spring-e-com.vercel.app](https://spring-e-com.vercel.app/)

## License

Private project (`package.json`: `"private": true`).
