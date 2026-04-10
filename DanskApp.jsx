const { useState, useEffect } = React;

const part1 = "AIzaSyCWCy";
const part2 = "fQ5cap3kjArUeI-PUBSZ4V3FiwVnc";
const API_KEY = part1 + part2;

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"] },
    { id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:["Hvornår"] },
    { id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget"] },
    { id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger.", wh:["Hvad"] }
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
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvor"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad"] },
    { id:"rum", label:"Værelser", scene:"Huset har flere rum.", wh:["Hvor mange"] },
    { id:"have", label:"Have", scene:"Huset har en have.", wh:["Hvor stor"] },
    { id:"leje", label:"Husleje", scene:"De betaler husleje.", wh:["Hvor meget"] }
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
    setFeedback({ score: "load", simple: "AI tjekker din dansk..." });

    const prompt = `Du er en dansklærer. En elev øver sig til DU2 Modul 1. 
    Situation: ${c.scene}
    Elevens spørgsmål: "${text}"
    Tjek om spørgsmålet er korrekt dansk, om der er korrekt inversion (ordstilling). 
    Svar kort на dansk. Hvis der er fejl, så forklar hvorfor og giv den korrekte version.`;

    try {
      // КРИТИЧНЕ ОНОВЛЕННЯ: Використовуємо v1beta та модель Gemini 3 Flash Preview
      const model = "gemini-3-flash-preview";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFeedback({ score: "fejl", simple: `Помилка: ${errorData.error.message}` });
      } else {
        const data = await response.json();
        // Правильний шлях до тексту у відповіді API
        const aiText = data.candidates[0].content.parts[0].text;
        setFeedback({ score: "god", simple: aiText });
      }
    } catch (e) {
      setFeedback({ score: "fejl", simple: "Помилка мережі. Перевірте з'єднання." });
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

      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <div className="text-sm text-gray-400 mb-1 uppercase font-bold tracking-tight">{t.person}</div>
