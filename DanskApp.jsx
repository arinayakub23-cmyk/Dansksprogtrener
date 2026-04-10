const { useState, useEffect, useRef } = React;

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en city i Danmark.", wh:["Hvor","Hvilken"], hint:[] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"], hint:[] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"], hint:[] },
    { id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:["Hvornår"], hint:[] },
    { id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget"], hint:[] },
    { id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger.", wh:["Hvad","Hvem"], hint:[] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"], hint:[] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken","Hvad"], hint:[] },
    { id:"dage", label:"Dage/tid", scene:"Jonas går til fodbold på bestemte dage.", wh:["Hvornår"], hint:[] },
    { id:"sam", label:"Sammen med", scene:"Jonas spiller fodbold med andre spillere.", wh:["Hvem"], hint:[] },
    { id:"pris", label:"Pris", scene:"Det koster penge at spille i klubben.", wh:["Hvad"], hint:[] },
    { id:"trans", label:"Transport", scene:"Jonas kommer til træning på en bestemt måde.", wh:["Hvordan"], hint:[] }
  ]}
};

const COLOR = {
  god: { bg: "#EAF3DE", text: "#27500A", border: "#C0DD97" },
  ok: { bg: "#FAEEDA", text: "#633806", border: "#FAC775" },
  fejl:{ bg: "#FCEBEB", text: "#791F1F", border: "#F7C1C1" },
  load:{ bg: "#F1EFE8", text: "#5F5E5A", border: "#D3D1C7" },
};

function DanskApp() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
  const [answered, setAnswered] = useState({});
  const [inputs, setInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const t = topics[curT];
  const c = t.cards[curC];
  const key = curT + "_" + curC;

  async function check() {
    const val = (inputs[key] || "").trim();
    if (!val) return;
    setLoading(true);
    setFeedback({ score: "load", simple: "AI tjekker..." });
    
    // Тут буде ваш запит до API
    setTimeout(() => {
      setAnswered(a => ({ ...a, [key]: true }));
      setFeedback({ score: "god", ros: "Flot klaret!", grammatik: "Korrekt ordstilling." });
      setLoading(false);
    }, 1500);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px", maxWidth: 500, margin: "auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Dansk Træner</h2>
        <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
          {Object.keys(topics).map(k => (
            <button key={k} onClick={() => {setCurT(k); setCurC(0); setFeedback(null);}} 
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: curT === k ? "#3B82F6" : "#fff", color: curT === k ? "#fff" : "#000" }}>
              {topics[k].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, color: "#666" }}>{t.person} — Оберіть картку:</div>
        <div style={{ display: "flex", gap: 5, margin: "10px 0" }}>
          {t.cards.map((_, i) => (
            <div key={i} onClick={() => {setCurC(i); setFeedback(null);}} 
              style={{ width: 12, height: 12, borderRadius: "50%", cursor: "pointer", background: i === curC ? "#3B82F6" : (answered[curT+"_"+i] ? "#10B981" : "#ddd") }} />
          ))}
        </div>

        <div style={{ background: "#f9f9f9", padding: 12, borderRadius: 8, marginBottom: 15 }}>
          <div style={{ fontWeight: "bold" }}>{c.label}</div>
          <div>{c.scene}</div>
        </div>

        <textarea 
          value={inputs[key] || ""} 
          onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
          placeholder="Skriv dit spørgsmål..."
          style={{ width: "100%", height: 60, padding: 10,
