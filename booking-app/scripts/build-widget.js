const { build } = require("esbuild");
const path = require("path");

async function buildWidget() {
  try {
    await build({
      entryPoints: [path.resolve(__dirname, "../lib/widget.jsx")],
      bundle: true,
      outfile: path.resolve(__dirname, "../public/widget.js"),
      format: "iife",
      globalName: "GHLBookingWidget",
      minify: true,
      target: "es2017",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: [], // Bundle everything
      loader: {
        ".jsx": "jsx",
      },
      jsx: "automatic",
      banner: {
        js: "/* GHL Booking Widget - Embedded Version */",
      },
    });

    console.log("Widget built successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildWidget();
