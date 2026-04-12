import React, { useState, useRef, useEffect } from "react";

const topics = {
  A: { icon: "💼", label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor","Hvilken"], hint:[], examples:["Hvor arbejder Nanna?", "Hvilken by arbejder hun i?"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"], hint:[], examples:["Hvornår møder hun?"] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"], hint:[], examples:["Hvor arbejder hun?"] },
    { id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:["Hvornår"], hint:[], examples:["Hvornår har hun pause?"] },
    { id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget"], hint:[], examples:["Hvor meget tjener hun?"] },
    { id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger.", wh:["Hvad"], hint:[], examples:["Hvad taler de на роботі?"] }
  ]},
  B: { icon: "⚽", label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"], hint:[], examples:["Hvor spiller Jonas?"] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken"], hint:[], examples:["Hvilken klub er han med i?"] },
    { id:"dage", label:"Dage/tid", scene:"Jonas går til fodbold på bestemte dage.", wh:["Hvornår"], hint:[], examples:["Hvornår spiller han?"] },
    { id:"sam", label:"Sammen med", scene:"Jonas spiller fodbold med andre spillere.", wh:["Hvem"], hint:[], examples:["Hvem spiller han med?"] },
    { id:"pris", label:"Pris", scene:"Det koster penge at spille i klubben.", wh:["Hvad"], hint:[], examples:["Hvad koster det?"] },
    { id:"trans", label:"Transport", scene:"Jonas kommer til træning på en bestemt måde.", wh:["Hvordan"], hint:[], examples:["Hvordan kommer han до клубу?"] }
  ]},
  C: { icon: "🏠", label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvilken","Hvor"], hint:[], examples:["Hvor bor de?"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad"], hint:[], examples:["Hvad er deres adresse?"] },
    { id:"rum", label:"Værelser", scene:"Huset har flere rum.", wh:["Hvor mange"], hint:[], examples:["Hvor mange værelser er der?"] },
    { id:"have", label:"Have", scene:"Huset har en have.", wh:["Hvor stor"], hint:[], examples:["Hvor stor er haven?"] },
    { id:"leje", label:"Husleje", scene:"De betaler husleje.", wh:["Hvor meget"], hint:[], examples:["Hvor meget betaler de?"] }
  ]},
  D: { icon: "🏫", label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor"], hint:[], examples:["Hvor ligger skolen?"] },
    { id:"tid", label:"Dage/tid", scene:"Karla møder i skole на певний час.", wh:["Hvornår"], hint:[], examples:["Hvornår møder hun?"] },
    { id:"elev", label:"Elever", scene:"Der er elever i Karlas klasse.", wh:["Hvor mange"], hint:[], examples:["Hvor mange elever er der?"] },
    { id:"laer", label:"Lærer", scene:"Karla har en lærer.", wh:["Hvem"], hint:[], examples:["Hvem er hendes lærer?"] }
  ]},
  E: { icon: "🛠️", label: "E: Praktik", person: "Layla er i praktik", cards: [
    { id:"sted", label:"Sted", scene:"Layla er i praktik et sted i Danmark.", wh:["Hvor"], hint:[], examples:["Hvor er Layla i praktik?"] },
    { id:"opgv", label:"Opgaver", scene:"Layla laver forskellige opgaver.", wh:["Hvad"], hint:[], examples:["Hvad laver вона на практиці?"] }
  ]},
  F: { icon: "🦁", label: "F: Fritid (zoo)", person: "Mille er i Zoo", cards: [
    { id:"by", label:"By", scene:"Mille besøger en zoo i en by.", wh:["Hvilken"], hint:[], examples:["Hvilken by er zoo i?"] },
    { id:"sam", label:"Sammen med", scene:"Mille er i zoo med nogen.", wh:["Hvem"], hint:[], examples:["Hvem er вона в зоопарку з?"] }
  ]}
};

// БЕЗПЕЧНЕ ОТРИМАННЯ КЛЮЧА З VERCEL
// Ця конструкція не дає застосунку зламатися (білий екран)
const getSafeKey = () => {
  try {
    return process.env.REACT_APP_GEMINI_KEY || "";
  } catch (e) {
    return "";
  }
};

const API_KEY = getSafeKey();

export default function App() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
  const [inputs, setInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = topics[curT];
  const c = t.cards[curC];
  const key = curT + "_" + curC;

  async function check() {
    const val = (inputs[key] || "").trim();
    if (!val) return;

    if (!API_KEY) {
      setFeedback({ score: "fejl", simple: "Помилка: Ключ REACT_APP_GEMINI_KEY не знайдено у Vercel." });
      return;
    }

    setLoading(true);
    setFeedback({ score: "load", simple: "AI tjekker... 🤖" });

    try {
      // Використовуємо v1beta та модель flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Ти вчитель данської. Перевір: "${val}"` }] }] })
      });
      const data = await res.json();
      setFeedback({ score: "god", simple: data.candidates[0].content.parts[0].text });
    } catch (e) {
      setFeedback({ score: "fejl", simple: "Проблема з підключенням до API." });
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#3B82F6", textAlign: "center" }}>🇩🇰 Dansk Træner</h1>
      
      {!API_KEY && (
        <div style={{ background: "#FEF3C7", padding: "10px", borderRadius: "8px", marginBottom: "10px", fontSize: "12px" }}>
          ⚠️ <strong>Попередження:</strong> Застосунок не бачить ключ з Vercel. 
          Переконайтеся, що ви зробили <strong>Redeploy</strong> після додавання ключа.
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}>
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => {setCurT(k); setCurC(0); setFeedback(null);}} 
            style={{ padding: "8px", borderRadius: "20px", background: k === curT ? "#3B82F6" : "#f3f4f6", color: k === curT ? "#fff" : "#000", border: "1px solid #ccc" }}>
            {topics[k].label}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid #e5e7eb", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "bold" }}>{t.person}</div>
        <h2 style={{ fontSize: "18px", margin: "10px 0" }}>{c.label}</h2>
        <div style={{ background: "#eff6ff", padding: "15px", borderRadius: "10px", fontStyle: "italic", marginBottom: "15px" }}>"{c.scene}"</div>

        <textarea 
          style={{ width: "100%", height: "80px", borderRadius: "10px", padding: "10px", border: "1px solid #d1d5db" }}
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
          placeholder="Skriv dit spørgsmål..."
        />

        <button onClick={check} disabled={loading} style={{ width: "100%", marginTop: "10px", padding: "12px", borderRadius: "10px", background: "#10B981", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "Tænker..." : "Tjek med AI 🤖"}
        </button>

        {feedback && (
          <div style={{ marginTop: "15px", padding: "10px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #eee", fontSize: "14px" }}>
            {feedback.simple}
          </div>
        )}
      </div>
    </div>
  );
}
