# Booking App

Next.js frontend for the universal booking system.

## Setup

```bash
cd booking-app
npm install
npm run dev
```

## Usage

1. Start the mock server first:

```bash
cd ../universal-booking-starter
npm install
npm start
# Server runs on http://localhost:5050
```

2. Then start the Next.js app:

```bash
npm run dev
# App runs on http://localhost:3000
```

## Routes

- `/` - Home page with vertical links
- `/booking/salon` - Salon booking flow
- `/booking/class` - Class booking flow
- `/booking/rental` - Rental booking flow
- `/embed/[vertical]` - Embeddable widget versions

## Embeddable Widget

Build the embeddable widget:

```bash
npm run build-widget
```

Then use in any HTML page:

```html
<div id="ghl-booking" data-config="/configs/salon.json"></div>
<script src="/widget.js" async></script>
```

Go to /demo.html to see the working example (right now hardcoded for salon config)

The widget reuses all existing React components and flows, just bundled for embedding.

## Features

- SSR with config fetching from mock server
- Dynamic theming based on config
- API integration for availability and booking
- Responsive design with CSS variables
- Embeddable widget that reuses existing components
