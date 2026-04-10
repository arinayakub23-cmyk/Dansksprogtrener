const { useState, useEffect, useRef } = React;

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor","Hvilken"], hint:[] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"], hint:[] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"], hint:[] },
    { id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:["Hvornår"], hint:[] },
    { id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget"], hint:[] },
    { id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger.", wh:["Hvad","Hvem"], hint:[] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"], hint:[] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken"], hint:[] },
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
  const key = `${curT}_${curC}`;

  const check = () => {
    const val = (inputs[key] || "").trim();
    if (!val) return;
    setLoading(true);
    setFeedback({ score: "load", simple: "Tjekker..." });
    
    // Імітація перевірки (оскільки для API потрібні складні налаштування)
    setTimeout(() => {
      setAnswered(prev => ({ ...prev, [key]: true }));
      setFeedback({ score: "god", simple: "Godt klaret! Flot spørgsmål." });
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '15px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>🇩🇰 Dansk Træner</h2>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', overflowX: 'auto' }}>
          {Object.keys(topics).map(k => (
            <button key={k} onClick={() => {setCurT(k); setCurC(0); setFeedback(null);}} 
              style={{ padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', 
              background: curT === k ? '#3B82F6' : 'white', color: curT === k ? 'white' : 'black', whiteSpace: 'nowrap' }}>
              {topics[k].label}
            </button>
          ))}
        </div>

        <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{c.label} ({t.person})</div>
          <div style={{ fontSize: '15px', marginTop: '5px' }}>{c.scene}</div>
        </div>

        <textarea 
          value={inputs[key] || ""} 
          onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
          placeholder="Skriv dit spørgsmål her..."
          style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' }}
        />

        <button onClick={check} disabled={loading} style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          {loading ? "Vent..." : "Tjek"}
        </button>

        {feedback && (
          <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', background: COLOR[feedback.score].bg, color: COLOR[feedback.score].text, border: `1px solid ${COLOR[feedback.score].border}` }}>
            {feedback.simple}
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DanskApp />);
