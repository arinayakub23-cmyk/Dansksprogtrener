const { useState, useEffect, useRef } = React;

// AIzaSyBCyhPMUX1vly-Hob_Q0LehPa0aVXM6jE4
const API_KEY = "AIzaSyBCyhPMUX1vly-Hob_Q0LehPa0aVXM6jE4"; 

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"] },
    { id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:["Hvornår"] },
    { id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget"] },
    { id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger.", wh:["Hvad","Hvem"] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken"] },
    { id:"dage", label:"Dage", scene:"Jonas spiller fodbold på bestemte dage.", wh:["Hvornår"] },
    { id:"sam", label:"Sammen med", scene:"Jonas spiller fodbold med andre spillere.", wh:["Hvem"] },
    { id:"pris", label:"Pris", scene:"Det koster penge at spille i klubben.", wh:["Hvad"] },
    { id:"trans", label:"Transport", scene:"Jonas kommer til træning på en bestemt måde.", wh:["Hvordan"] }
  ]},
  C: { label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvilken","Hvor"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad","Hvilken"] },
    { id:"rum", label:"Værelser", scene:"Huset har flere rum.", wh:["Hvor mange"] },
    { id:"have", label:"Have", scene:"Huset har en have.", wh:["Hvor stor","Har de"] },
    { id:"nabo", label:"Naboer", scene:"John og Emma har naboer.", wh:["Hvem"] },
    { id:"leje", label:"Husleje", scene:"De betaler husleje.", wh:["Hvor meget"] }
  ]},
  D: { label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Dage/tid", scene:"Karla møder i skole på bestemte tider.", wh:["Hvornår"] },
    { id:"elev", label:"Elever", scene:"Der er mange elever i klassen.", wh:["Hvor mange"] },
    { id:"laer", label:"Lærer", scene:"Karla har en god lærer.", wh:["Hvem","Hvad"] },
    { id:"pause", label:"Pauser", scene:"Eleverne har pauser.", wh:["Hvornår"] },
    { id:"trans", label:"Transport", scene:"Karla bruger transport til skole.", wh:["Hvordan"] }
  ]},
  E: { label: "E: Praktik", person: "Layla er i praktik", cards: [
    { id:"sted", label:"Sted/by", scene:"Layla er i praktik et sted i Danmark.", wh:["Hvor"] },
    { id:"tid", label:"Tid", scene:"Layla arbejder на bestemte tidspunkter.", wh:["Hvornår"] },
    { id:"opgv", label:"Opgaver", scene:"Layla laver opgaver i praktikken.", wh:["Hvilke"] },
    { id:"frok", label:"Frokost", scene:"Layla spiser i pausen.", wh:["Hvad"] },
    { id:"tran", label:"Transport", scene:"Layla bruger transport.", wh:["Hvordan"] },
    { id:"lang", label:"Hvor lang tid", scene:"Layla er i praktik i en periode.", wh:["Hvor længe"] }
  ]},
  F: { label: "F: Fritid (zoo)", person: "Mille er i Zoologisk Have", cards: [
    { id:"by", label:"By", scene:"Mille besøger en zoo.", wh:["Hvilken","Hvor"] },
    { id:"tid", label:"Tid", scene:"Mille er i zoo на en bestemt dag.", wh:["Hvornår"] },
    { id:"sam", label:"Sammen med", scene:"Mille er i zoo med nogen.", wh:["Hvem"] },
    { id:"akt", label:"Aktiviteter", scene:"Der er dyr i zoo.", wh:["Hvilke"] },
    { id:"mad", label:"Mad", scene:"Mille spiser noget.", wh:["Hvad"] },
    { id:"pris", label:"Pris", scene:"Det koster penge.", wh:["Hvad"] }
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
    setFeedback({ score: "load", simple: "AI tjekker din grammatik..." });

    const prompt = `Du er en dansklærer. En elev øver sig til DU2 Modul 1. 
    Situation: ${c.scene}
    Tema: ${c.label}
    Elevens spørgsmål: "${text}"
    Tjek om spørgsmålet er korrekt dansk, om der er korrekt inversion (ordstilling), og om det passer til situationen. 
    Svar kort på dansk. Hvis der er fejl, så forklar hvorfor og giv den korrekte version.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      setFeedback({ score: "god", simple: aiText });
    } catch (e) {
      setFeedback({ score: "fejl", simple: "Kunne ikke forbinde til AI. Tjek din internetforbindelse." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-600">🇩🇰 Dansk AI Træner</h1>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => {setCurT(k); setCurC(0); setFeedback(null);}} 
            className={`px-4 py-2 rounded-full border whitespace-nowrap transition-all ${curT === k ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700'}`}>
            {topics[k].label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-sm text-gray-500 mb-2 uppercase font-semibold">{t.person}</div>
        <div className="text-lg font-bold text-gray-800 mb-4">{c.label}</div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6 italic text-gray-700 border-l-4 border-blue-400">
          "{c.scene}"
        </div>

        <textarea 
          className="w-full h-24 p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
          placeholder="Skriv dit spørgsmål..."
        />

        <button onClick={checkWithAI} disabled={loading}
          className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}>
          {loading ? "Tænker..." : "Tjek med AI 🤖"}
        </button>

        {feedback && (
          <div className={`mt-4 p-4 rounded-xl border ${feedback.score === 'load' ? 'bg-gray-100' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{feedback.simple}</div>
          </div>
        )}

        <div className="flex justify-between mt-6 gap-4">
          <button onClick={() => {setCurC(Math.max(0, curC - 1)); setFeedback(null);}} disabled={curC === 0}
            className="flex-1 px-4 py-3 bg-gray-200 rounded-xl font-semibold disabled:opacity-50">Назад</button>
          <button onClick={() => {setCurC(Math.min(t.cards.length - 1, curC + 1)); setFeedback(null);}}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold">Далі</button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DanskApp />);
