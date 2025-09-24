import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { hydrateRoot, createRoot } from "react-dom/client";
import BookingWidget from "../components/BookingWidget";
import config from "../../universal-booking-starter/configs/salon.json";

// Progressive hydration component that manages the hydration lifecycle
function ProgressiveBookingWidget({ config, embedded = true }) {
  const [hydrationStage, setHydrationStage] = useState("ssr");
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    // Start progressive hydration after component mounts
    const timer = setTimeout(() => {
      setHydrationStage("hydrating");
      // Allow interaction after hydration begins
      setTimeout(() => {
        setIsInteractive(true);
        setHydrationStage("interactive");
      }, 100);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // During SSR stage, render a static version
  if (hydrationStage === "ssr") {
    return (
      <div
        className="widget-loading"
        style={{ opacity: 0.8, pointerEvents: "none" }}
      >
        <BookingWidget
          config={config}
          embedded={embedded}
          suppressHydrationWarning
        />
      </div>
    );
  }

  // During hydrating stage, show loading state
  if (hydrationStage === "hydrating") {
    return (
      <div
        className="widget-hydrating"
        style={{ opacity: 0.9, pointerEvents: "none" }}
      >
        <BookingWidget config={config} embedded={embedded} />
        <div
          className="hydration-indicator"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  // Fully interactive stage
  return (
    <div className="widget-interactive">
      <BookingWidget config={config} embedded={embedded} />
    </div>
  );
}

(async function () {
  const container = document.getElementById("my-widget");
  if (!container) return;

  try {
    // Step 1: Fetch and display SSR HTML immediately
    const res = await fetch("/api/widget-html");
    const html = await res.text();
    container.innerHTML = html;

    // Step 2: Progressive hydration - start with SSR content visible
    // Add a small delay to ensure the SSR content is visible first
    setTimeout(() => {
      // Check if there's existing content to hydrate
      const hasExistingContent = container.children.length > 0;

      if (hasExistingContent) {
        // Hydrate existing SSR content progressively
        hydrateRoot(
          container,
          <ProgressiveBookingWidget config={config} embedded={true} />,
          {
            // Suppress hydration warnings during progressive loading
            onRecoverableError: (error) => {
              console.warn(
                "Hydration warning (expected during progressive hydration):",
                error
              );
            },
          }
        );
      } else {
        // Fallback: render from scratch if no SSR content
        const root = createRoot(container);
        root.render(
          <ProgressiveBookingWidget config={config} embedded={true} />
        );
      }
    }, 100);
  } catch (error) {
    console.error(
      "Failed to load SSR content, falling back to client-side rendering:",
      error
    );
    // Fallback to client-side rendering
    const root = createRoot(container);
    root.render(<ProgressiveBookingWidget config={config} embedded={true} />);
  }
})();
