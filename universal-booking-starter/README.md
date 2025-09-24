# Universal Booking Starter — Mocks & Configs

This folder gives candidates a **baseline** to build an SSR-first, config-driven booking UI.

## What’s included
- `configs/` — Three vertical configs: **salon**, **class**, **rental**.
- `mock-server/` — Tiny **Express** server with endpoints:
  - `GET /api/config?vertical=salon|class|rental`
  - `GET /api/availability?serviceId&providerId&start&end`
  - `GET /api/sessions?classId&start&end`
  - `GET /api/inventory?itemId&startDate&endDate`
  - `POST /api/book`
  - Built-in **latency** (100–600ms), **8% failure rate**, `x-request-id` propagation.
- `sample-data/` — Optional lookups (services to providers).

## Quick start
```bash
cd universal-booking-starter
npm install
npm start
# Server on http://localhost:5050
# Try: curl 'http://localhost:5050/api/config?vertical=salon'
```

## Config contract (high level)
Each `configs/*.json` contains:
- `vertical` — `salon` | `class` | `rental`
- `branding.theme` — for CSS variables
- `timeScale` — `time` (grid) or `date` (date-range)
- `catalog` — items/classes/rentals (ids feed API queries)
- `resources` — providers/rooms (as needed)
- `capacityModel` — `per_resource` | `seat_based` | `inventory`
- `constraints` & `policies` — lead time, horizons, overlap, waitlist
- `layout.flow` — defines the booking steps order
- `availability.endpoint` & `queryMap` — how the UI should call availability
- `booking.endpoint` — where to POST a booking

Candidates **must not** change these contracts; they can extend locally if well-documented.
