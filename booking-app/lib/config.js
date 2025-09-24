const API_BASE = "http://localhost:5050";

export async function getConfig(vertical) {
  const response = await fetch(`${API_BASE}/api/config?vertical=${vertical}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch config for ${vertical}`);
  }
  return response.json();
}
