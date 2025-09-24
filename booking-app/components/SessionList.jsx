"use client";

export default function SessionList({ config, sessions = [] }) {
  const handleBooking = async (session) => {
    try {
      const response = await fetch("http://localhost:5050/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: config.vertical,
          sessionId: session.id,
        }),
      });
      const result = await response.json();
      alert(result.success ? "Booking confirmed!" : "Booking failed");
    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h2>{config.copy.sessionLabel}</h2>
      <div className="grid">
        {sessions.map((session) => (
          <button
            key={session.id}
            className="button card"
            onClick={() => handleBooking(session)}
            disabled={session.seatsLeft === 0}
          >
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <span>{session.time}</span>
              <span className="text-sm text-muted">
                {session.seatsLeft} {config.copy.seatsLeftLabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
