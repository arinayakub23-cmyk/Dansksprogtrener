const { useState, useEffect } = React;

// Це фікс для білого екрана: створюємо безпечну змінну
// Якщо ви використовуєте звичайний HTML/JS, process.env не існує,
// тому ми додаємо перевірку, щоб код не "падав".
const getApiKey = () => {
  try {
    return process.env.REACT_APP_GEMINI_KEY || "NO_KEY";
  } catch (e) {
    return "NO_KEY";
  }
};

const API_KEY = getApiKey();

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"] }
  ]}
};

function DanskApp() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
  const [inputs, setInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = topics[curT];
  const c = t.cards[curC];
  const key = `${curT}_${curC}`;

  const checkWithAI = async () => {
    const text = (inputs[key] || "").trim();
    if (!text) return;

    if (API_KEY === "NO_KEY") {
      setFeedback({ score: "fejl", simple: "Ключ не знайдено. Перевірте налаштування Vercel." });
      return;
    }

    setLoading(true);
    setFeedback({ score: "load", simple: "AI аналізує..." });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Ти вчитель данської мови. Перевір речення: "${text}".` }] }]
        })
      });

      const data = await response.json();
      if (data.candidates) {
        setFeedback({ score: "god", simple: data.candidates[0].content.parts[0].text });
      } else {
        setFeedback({ score: "fejl", simple: "Помилка API. Перевірте ключ." });
      }
    } catch (e) {
      setFeedback({ score: "fejl", simple: "Помилка мережі." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-blue-600 text-center">Dansk Træner</h1>
      
      {API_KEY === "NO_KEY" && (
        <div className="bg-yellow-100 p-2 text-xs mb-4 rounded text-center">
          ⚠️ Увага: Ключ REACT_APP_GEMINI_KEY не підключено у Vercel.
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => setCurT(k)} className={`px-4 py-2 rounded-full ${curT === k ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
            {topics[k].label}
          </button>
        ))}
      </div>

      <div className="border p-6 rounded-2xl shadow-lg">
        <p className="text-xs text-gray-400 uppercase font-bold">{t.person}</p>
        <h2 className="text-lg font-bold mb-4">{c.label}</h2>
        <div className="bg-blue-50 p-4 rounded-xl mb-4 italic">"{c.scene}"</div>

        <textarea 
          className="w-full h-24 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
          placeholder="Skriv her..."
        />

        <button onClick={checkWithAI} disabled={loading} className="w-full mt-4 py-3 bg-green-500 text-white rounded-xl font-bold">
          {loading ? "Tænker..." : "Tjek з AI"}
        </button>

        {feedback && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm border">{feedback.simple}</div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DanskApp />);
