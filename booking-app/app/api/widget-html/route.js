export const runtime = "nodejs";

import React from "react";
import config from "../../../../universal-booking-starter/configs/salon.json";

// SSR-optimized component that renders static content for progressive hydration
function SSRBookingWidget({ config, embedded = true }) {
  const themeVars = {
    "--color-primary": config.branding.theme.primary,
    "--color-background": config.branding.theme.background,
    "--color-text": config.branding.theme.text,
  };

  const containerClass = embedded ? "widget-embedded" : "container";

  return (
    <div
      className={containerClass}
      style={themeVars}
      data-hydration-ready="false"
    >
      <div className="card">
        <h1>{config.branding.name}</h1>

        {/* Render initial static content based on vertical */}
        {config.vertical === "salon" && (
          <div data-component="salon-flow">
            <div data-step="service">
              <h2>{config.copy.servicesLabel}</h2>
              <div className="grid grid-2">
                {config.catalog.map((service) => (
                  <button
                    key={service.id}
                    className="button card"
                    data-service-id={service.id}
                    disabled
                  >
                    <div>
                      <h3>{service.name}</h3>
                      <p className="text-muted">
                        ${service.price} • {service.durationMinutes}min
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {config.vertical === "class" && (
          <div data-component="class-flow">
            <h2>{config.copy.sessionLabel}</h2>
            <div className="grid">
              <div className="button card" disabled>
                <div
                  className="flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>Loading sessions...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {config.vertical === "rental" && (
          <div data-component="rental-flow">
            <div data-step="dateRange">
              <h2>{config.copy.dateRangeLabel}</h2>
              <div className="flex">
                <input type="date" className="input" disabled />
                <input type="date" className="input" disabled />
              </div>
              <button className="button" style={{ marginTop: "16px" }} disabled>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Progressive hydration indicator */}
        <div
          className="ssr-content-marker"
          style={{ display: "none" }}
          data-ssr-timestamp={Date.now()}
        />
      </div>
    </div>
  );
}

export async function GET() {
  const ReactDOMServer = await import("react-dom/server");

  const html = ReactDOMServer.renderToString(
    <SSRBookingWidget config={config} embedded={true} />
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60", // Cache for 1 minute
    },
  });
}
