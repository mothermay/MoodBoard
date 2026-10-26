const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function askGemini(prompt, schema) {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is missing. Add it to backend/.env.");
    err.status = 503;
    err.expose = true;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.45,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.text();
    const err = new Error(`Gemini request failed: ${response.status}`);
    err.status = 502;
    err.expose = true;
    console.error("Gemini:", detail);
    throw err;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";

  if (!text) {
    const err = new Error("Gemini returned an empty response.");
    err.status = 502;
    err.expose = true;
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error("Gemini returned invalid structured data.");
    err.status = 502;
    err.expose = true;
    throw err;
  }
}
