const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-request-id"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// simple latency & fault injection
function withChaos(handler) {
  return async (req, res) => {
    const delay = Math.floor(Math.random() * 500) + 100; // 100-600ms
    const fail = Math.random() < 0.08; // 8% failure
    const reqId =
      req.headers["x-request-id"] || Math.random().toString(36).slice(2);
    res.set("x-request-id", reqId);
    setTimeout(async () => {
      if (fail) {
        console.error(
          JSON.stringify({
            level: "error",
            event: "api_error",
            reqId,
            route: req.path,
          })
        );
        res.status(500).json({ error: "Injected failure", reqId });
        return;
      }
      try {
        await handler(req, res, reqId);
      } catch (e) {
        console.error(
          JSON.stringify({
            level: "error",
            event: "unhandled",
            message: e.message,
            stack: e.stack,
            reqId,
          })
        );
        res.status(500).json({ error: "Unhandled error", reqId });
      }
    }, delay);
  };
}

function readConfig(vertical) {
  const p = path.join(__dirname, "..", "configs", `${vertical}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

app.get(
  "/api/config",
  withChaos(async (req, res) => {
    const v = (req.query.vertical || "salon").toString();
    const data = readConfig(v);
    res.json(data);
  })
);

// /api/availability?serviceId&providerId&start&end
app.get(
  "/api/availability",
  withChaos(async (req, res) => {
    const { serviceId, providerId, start, end } = req.query;
    // generate 15-min slots between start and end
    const startTs = start ? new Date(start).getTime() : Date.now();
    const endTs = end ? new Date(end).getTime() : startTs + 24 * 3600 * 1000;
    const interval = 15 * 60 * 1000;
    const slots = [];
    for (let t = startTs; t < endTs; t += interval) {
      const available = Math.random() > 0.2; // 80% available
      const capacityRemaining = available ? (Math.random() > 0.7 ? 2 : 1) : 0;
      slots.push({
        start: new Date(t).toISOString(),
        end: new Date(t + interval).toISOString(),
        available,
        capacityRemaining,
      });
    }
    res.json({ serviceId, providerId, slots });
  })
);

// /api/sessions?classId&start&end
app.get(
  "/api/sessions",
  withChaos(async (req, res) => {
    const { classId, start, end } = req.query;
    const startDate = start ? new Date(start) : new Date();
    const sessions = [];
    for (let d = 0; d < 7; d++) {
      const dayStart = new Date(startDate.getTime() + d * 24 * 3600 * 1000);
      for (const hour of [7, 9, 18]) {
        const s = new Date(dayStart);
        s.setHours(hour, 0, 0, 0);
        const seatsTotal = classId === "pilates" ? 15 : 20;
        const seatsBooked = Math.floor(Math.random() * seatsTotal);
        sessions.push({
          id: `sess_${s.getTime()}`,
          classId,
          start: s.toISOString(),
          end: new Date(s.getTime() + 60 * 60 * 1000).toISOString(),
          seatsTotal,
          seatsBooked,
        });
      }
    }
    res.json({ classId, sessions });
  })
);

// /api/inventory?itemId&startDate&endDate
app.get(
  "/api/inventory",
  withChaos(async (req, res) => {
    const { itemId, startDate, endDate } = req.query;
    const sd = startDate ? new Date(startDate) : new Date();
    const ed = endDate
      ? new Date(endDate)
      : new Date(sd.getTime() + 7 * 24 * 3600 * 1000);
    const days = Math.ceil((ed - sd) / (24 * 3600 * 1000));
    const inventory = [];
    const base = itemId === "apt_city" ? 3 : 8;
    for (let i = 0; i < days; i++) {
      const d = new Date(sd.getTime() + i * 24 * 3600 * 1000);
      // random bookings reduce availability
      const booked = Math.floor(Math.random() * Math.min(5, base));
      const availableCount = Math.max(0, base - booked);
      inventory.push({ date: d.toISOString().slice(0, 10), availableCount });
    }
    res.json({ itemId, inventory });
  })
);

// POST /api/book
app.post(
  "/api/book",
  withChaos(async (req, res, reqId) => {
    const payload = req.body || {};
    const bookingId = "bk_" + Math.random().toString(36).slice(2, 10);
    // naive rule: if client passes capacityRemaining===0, reject; else confirm
    const status = payload.capacityRemaining === 0 ? "rejected" : "confirmed";
    console.log(
      JSON.stringify({
        level: "info",
        event: "booking_attempt",
        status,
        reqId,
        payloadSummary: {
          vertical: payload.vertical,
          selection: payload.selection,
        },
      })
    );
    res.json({ bookingId, status, reqId });
  })
);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Mock server running on http://localhost:${port}`);
});
