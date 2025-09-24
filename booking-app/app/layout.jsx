import "./globals.css";

export const metadata = {
  title: "Universal Booking",
  description: "Config-driven booking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
