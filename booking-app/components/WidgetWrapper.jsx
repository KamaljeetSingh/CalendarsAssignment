"use client";

import { useState, useEffect } from "react";
import BookingWidget from "./BookingWidget";

// Progressive wrapper that manages hydration states and styling
export default function WidgetWrapper({
  config,
  initialHydrationStage = "ssr",
}) {
  const [hydrationStage, setHydrationStage] = useState(initialHydrationStage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Progressive hydration lifecycle
    const progressiveHydrate = () => {
      // Stage 1: SSR content is visible (immediate)
      setHydrationStage("ssr");

      // Stage 2: Begin hydration (after short delay)
      setTimeout(() => {
        setHydrationStage("hydrating");

        // Stage 3: Ready for interaction
        setTimeout(() => {
          setHydrationStage("interactive");
          setIsReady(true);
        }, 150);
      }, 100);
    };

    progressiveHydrate();
  }, []);

  const getWrapperClasses = () => {
    const baseClass = "ghl-booking-widget";
    const stageClass = `hydration-${hydrationStage}`;
    return `${baseClass} ${stageClass}`;
  };

  return (
    <>
      <style jsx global>{`
        .ghl-booking-widget {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          max-width: 400px;
          margin: 0;
          padding: 16px;
          position: relative;
          transition: opacity 0.3s ease-in-out;
        }

        .ghl-booking-widget * {
          box-sizing: border-box;
        }

        .ghl-booking-widget .widget-embedded {
          max-width: none;
          margin: 0;
          padding: 0;
        }

        /* Progressive hydration states */
        .ghl-booking-widget.hydration-ssr {
          opacity: 0.85;
        }

        .ghl-booking-widget.hydration-ssr button,
        .ghl-booking-widget.hydration-ssr input {
          pointer-events: none;
          cursor: not-allowed;
        }

        .ghl-booking-widget.hydration-hydrating {
          opacity: 0.95;
        }

        .ghl-booking-widget.hydration-hydrating::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 70%
          );
          animation: shimmer 1.5s infinite;
          pointer-events: none;
        }

        .ghl-booking-widget.hydration-interactive {
          opacity: 1;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Enhanced visual feedback */
        .ghl-booking-widget button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ghl-booking-widget input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      <div
        className={getWrapperClasses()}
        data-hydration-stage={hydrationStage}
        data-ready={isReady}
      >
        <BookingWidget
          config={config}
          embedded={true}
          hydrationStage={hydrationStage}
          isReady={isReady}
        />
      </div>
    </>
  );
}
