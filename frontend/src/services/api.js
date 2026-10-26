const API = "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("moodboard_token");
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API}${path}`, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export async function upload(path, formData) {
  const token = localStorage.getItem("moodboard_token");
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Upload failed.");
  return data;
}
