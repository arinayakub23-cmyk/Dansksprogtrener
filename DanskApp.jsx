import React, { useState, useEffect } from "react";

// ВІДНОВЛЕНІ ДАНІ (Теми A-F)
const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [{ id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor"] }] },
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [{ id:"sted", label:"Sted", scene:"Jonas spiller fodbold.", wh:["Hvor"] }] },
  C: { label: "C: Bolig", person: "John og Emma bor i et hus", cards: [{ id:"by", label:"By", scene:"De bor i Danmark.", wh:["Hvor"] }] },
  D: { label: "D: Skole", person: "Karla går i skole", cards: [{ id:"sted", label:"Sted", scene:"Karla går i skole.", wh:["Hvor"] }] },
  E: { label: "E: Praktik", person: "Layla er i praktik", cards: [{ id:"sted", label:"Sted", scene:"Layla er i praktik.", wh:["Hvor"] }] },
  F: { label: "F: Fritid (zoo)", person: "Mille er i Zoo", cards: [{ id:"by", label:"By", scene:"Mille er i zoo.", wh:["Hvilken"] }] }
};

export default function App() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
  const [inputs, setInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // ЦЕЙ БЛОК ОЖИВЛЯЄ КЛЮЧ З VERCEL
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Намагаємося дістати ключ з оточення Vercel
    // Якщо його немає, apiKey залишиться порожнім, але сайт НЕ впаде
    try {
      const key = process.env.REACT_APP_GEMINI_KEY || window._env_?.REACT_APP_GEMINI_KEY;
      if (key) setApiKey(key);
    } catch (e) {
      console.log("Ключ з Vercel поки не доступний");
    }
  }, []);

  const t = topics[curT];
  const c = t.cards[curC];
  const key = curT + "_" + curC;

  async function check() {
    const val = (inputs[key] || "").trim();
    if (!val || !apiKey) {
      if (!apiKey) alert("Ключ не знайдено у Vercel! Зробіть Redeploy.");
      return;
    }

    setLoading(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Ти вчитель данської. Перевір: "${val}"` }] }] })
      });
      const data = await res.json();
      setFeedback(data.candidates[0].content.parts[0].text);
    } catch (e) {
      setFeedback("Помилка підключення.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#3B82F6" }}>🇩🇰 Dansk App</h1>
      
      {/* Індикатор ключа */}
      {!apiKey && (
        <div style={{ background: "#FFFBEB", padding: "10px", borderRadius: "8px", fontSize: "12px", border: "1px solid #FEF3C7", marginBottom: "15px" }}>
          ⚠️ <strong>Статус:</strong> Ключ з Vercel ще не підвантажився. Переконайтеся, що ви натиснули <strong>Redeploy</strong> після додавання ключа.
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}>
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => setCurT(k)} style={{
            padding: "8px 12px", borderRadius: "20px", border: "1px solid #ddd",
            background: k === curT ? "#3B82F6" : "#fff", color: k === curT ? "#fff" : "#000"
          }}>{topics[k].label}</button>
        ))}
      </div>

      <div style={{ border: "1px solid #eee", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>{t.person}</div>
        <h3 style={{ margin: "10px 0" }}>{c.label}</h3>
        <p style={{ background: "#f0f7ff", padding: "10px", borderRadius: "8px" }}>{c.scene}</p>

        <textarea 
          style={{ width: "100%", height: "80px", borderRadius: "10px", padding: "10px", border: "1px solid #ddd" }}
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
        />

        <button onClick={check} disabled={loading || !apiKey} style={{
          width: "100%", marginTop: "10px", padding: "12px", borderRadius: "10px",
          background: loading || !apiKey ? "#ccc" : "#10B981", color: "#fff", border: "none", fontWeight: "bold"
        }}>
          {loading ? "Tænker..." : "Tjek med AI"}
        </button>

        {feedback && <div style={{ marginTop: "15px", fontSize: "14px" }}>{feedback}</div>}
      </div>
    </div>
  );
}
