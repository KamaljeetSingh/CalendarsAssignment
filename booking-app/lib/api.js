const API_BASE = "http://localhost:5050";

export async function getSessions() {
  try {
    const params = new URLSearchParams({
      start: new Date().toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const response = await fetch(`${API_BASE}/api/sessions?${params}`, {
      cache: "no-store", // Always fetch fresh data for SSR
    });
    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    // Fallback to mock data
    return [
      {
        id: "yoga-mon-9",
        class: "yoga101",
        time: "Mon 9:00 AM",
        seatsLeft: 5,
      },
      {
        id: "yoga-tue-9",
        class: "yoga101",
        time: "Tue 9:00 AM",
        seatsLeft: 12,
      },
      {
        id: "pilates-wed-10",
        class: "pilates",
        time: "Wed 10:00 AM",
        seatsLeft: 3,
      },
    ];
  }
}
