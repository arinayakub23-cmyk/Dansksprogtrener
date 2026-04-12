const { useState, useEffect } = React;

// ВСТАВТЕ ВАШ НОВИЙ КЛЮЧ ПОВНІСТЮ:
const API_KEY = "ВАШ_НОВИЙ_КЛЮЧ_СЮДИ"; 

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken"] }
  ]},
  C: { label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvor"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad"] }
  ]}
};

function DanskApp() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
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

  const checkWithAI = async () => {
    const text = (inputs[key] || "").trim();
    if (!text) return;

    setLoading(true);
    setFeedback({ score: "load", simple: "AI аналізує..." });

    try {
      const model = "gemini-1.5-flash"; // Стабільна модель
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Ти вчитель данської мови. Ситуація: ${c.scene}. Учень написав: "${text}". Перевір, чи правильно це данською мовою. Відповідай коротко данською.` }] }]
        })
      });

      const data = await response.json();

      if (data.error) {
        setFeedback({ score: "fejl", simple: `Помилка API: ${data.error.message}` });
      } else if (data.candidates && data.candidates[0].content) {
        setFeedback({ score: "god", simple: data.candidates[0].content.parts[0].text });
      } else {
        setFeedback({ score: "fejl", simple: "ШІ не зміг відповісти." });
      }
    } catch (e) {
      setFeedback({ score: "fejl", simple: "Помилка мережі." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-600">🇩🇰 Dansk AI Træner</h1>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => {setCurT(k); setCurC(0); setFeedback(null);}} 
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${curT === k ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
            {topics[k].label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <div className="text-sm text-gray-400 mb-1 font-bold uppercase">{t.person}</div>
        <div className="text-lg font-bold text-gray-800 mb-4">{c.label}</div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6 italic text-gray-700">
          "{c.scene}"
        </div>

        <textarea 
          className="w-full h-24 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
          placeholder="Skriv her..."
        />

        <button onClick={checkWithAI} disabled={loading}
          className={`w-full mt-4 py-3 rounded-xl font-bold text-white ${loading ? 'bg-gray-400' : 'bg-green-500'}`}>
          {loading ? "Tænker..." : "Tjek med AI 🤖"}
        </button>

        {feedback && (
          <div className="mt-4 p-4 rounded-xl border bg-green-50 text-green-800">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{feedback.simple}</div>
          </div>
        )}

        <div className="flex justify-between mt-6 gap-4">
          <button onClick={() => setCurC(Math.max(0, curC - 1))} className="flex-1 px-4 py-3 bg-gray-200 rounded-xl font-semibold">Назад</button>
          <button onClick={() => setCurC(Math.min(t.cards.length - 1, curC + 1))} className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold">Далі</button>
        </div>
      </div>
    </div>
  );
}

// Рендеринг
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<DanskApp />);
}
