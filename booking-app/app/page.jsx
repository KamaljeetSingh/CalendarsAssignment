import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Universal Booking System</h1>
      <div className="grid grid-3" style={{ marginTop: "24px" }}>
        <Link href="/booking/salon" className="card">
          <h2>Salon Booking</h2>
        </Link>
        <Link href="/booking/class" className="card">
          <h2>Class Booking</h2>
        </Link>
        <Link href="/booking/rental" className="card">
          <h2>Rental Booking</h2>
        </Link>
      </div>
    </div>
  );
}
