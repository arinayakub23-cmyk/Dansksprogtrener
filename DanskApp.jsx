const { useState, useEffect, useRef } = React;

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
    { id:"dage", label:"Dage", scene:"Jonas spiller fodbold на bestemte dage.", wh:["Hvornår"] },
    { id:"sam", label:"Sammen med", scene:"Jonas spiller fodbold med andre spillere.", wh:["Hvem"] },
    { id:"pris", label:"Pris", scene:"Det koster penge at spille i klubben.", wh:["Hvad"] },
    { id:"trans", label:"Transport", scene:"Jonas kommer til træning на en bestemt måde.", wh:["Hvordan"] }
  ]},
  C: { label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvilken","Hvor"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad","Hvilken"] },
    { id:"rum", label:"Værelser", scene:"Huset har flere rum og måske en kælder.", wh:["Hvor mange"] },
    { id:"have", label:"Have", scene:"Huset har en have.", wh:["Hvor stor","Har de"] },
    { id:"nabo", label:"Naboer", scene:"John og Emma har naboer i nærheden.", wh:["Hvem"] },
    { id:"leje", label:"Husleje", scene:"De betaler husleje eller ejer huset.", wh:["Hvor meget"] }
  ]},
  D: { label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Dage/tid", scene:"Karla møder i skole на bestemte tider.", wh:["Hvornår"] },
    { id:"elev", label:"Elever", scene:"Der er mange elever i Karlas klasse.", wh:["Hvor mange"] },
    { id:"laer", label:"Lærer", scene:"Karla har en god lærer.", wh:["Hvem","Hvad"] },
    { id:"pause", label:"Pauser", scene:"Eleverne har pauser i løbet af dagen.", wh:["Hvornår"] },
    { id:"trans", label:"Transport", scene:"Karla bruger transport til skole.", wh:["Hvordan"] }
  ]},
  E: { label: "E: Praktik", person: "Layla er i praktik", cards: [
    { id:"sted", label:"Sted/by", scene:"Layla er i praktik et sted i Danmark.", wh:["Hvor"] },
    { id:"tid", label:"Tid", scene:"Layla arbejder på bestemte tidspunkter.", wh:["Hvornår"] },
    { id:"opgv", label:"Opgaver", scene:"Layla laver forskellige opgaver i praktikken.", wh:["Hvilke"] },
    { id:"frok", label:"Frokost", scene:"Layla spiser i pausen i praktikken.", wh:["Hvad"] },
    { id:"tran", label:"Transport", scene:"Layla bruger transport til praktik.", wh:["Hvordan"] },
    { id:"lang", label:"Hvor lang tid", scene:"Layla er i praktik i en periode.", wh:["Hvor længe"] }
  ]},
  F: { label: "F: Fritid (zoo)", person: "Mille er i Zoologisk Have", cards: [
    { id:"by", label:"By", scene:"Mille besøger en zoo i en by.", wh:["Hvilken","Hvor"] },
    { id:"tid", label:"Tid", scene:"Mille er i zoo на en bestemt dag.", wh:["Hvornår"] },
    { id:"sam", label:"Sammen med", scene:"Mille er i zoo med nogen.", wh:["Hvem"] },
    { id:"akt", label:"Aktiviteter", scene:"Der er mange dyr i den zoologiske have.", wh:["Hvilke"] },
    { id:"mad", label:"Mad", scene:"Mille spiser noget i zoo.", wh:["Hvad"] },
    { id:"pris", label:"Pris", scene:"Det koster penge at komme ind i zoo.", wh:["Hvad"] }
  ]}
};

function DanskApp() {
  const [curT, setCurT] = useState("A");
  const [curC, setCurC] = useState(0);
  const [inputs, setInputs] = useState({});
  const [answered, setAnswered] = useState({});

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const t = topics[curT];
  const c = t.cards[curC];
  const key = `${curT}_${curC}`;

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-600">🇩🇰 Dansk Træner</h1>
      
      {/* Кнопки тем */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.keys(topics).map(k => (
          <button key={k} onClick={() => {setCurT(k); setCurC(0);}} 
            className={`px-4 py-2 rounded-full border whitespace-nowrap transition-all ${curT === k ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-300'}`}>
            {topics[k].label}
          </button>
        ))}
      </div>

      {/* Картка */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">{t.person}</div>
        <div className="text-lg font-bold text-gray-800 mb-4">{c.label}</div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6 italic text-gray-700 border-l-4 border-blue-400">
          "{c.scene}"
        </div>

        <div className="text-sm text-gray-500 mb-2">Hv-ord: {c.wh.join(", ")}</div>
        
        <textarea 
          className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
          value={inputs[key] || ""} 
          onChange={e => setInputs({...inputs, [key]: e.target.value})}
          placeholder="Skriv dit spørgsmål her..."
        />

        {/* Навігація між картками */}
        <div className="flex justify-between mt-6 gap-4">
          <button onClick={() => setCurC(Math.max(0, curC - 1))} disabled={curC === 0}
            className="flex-1 px-4 py-3 bg-gray-200 rounded-xl font-semibold disabled:opacity-50">Назад</button>
          <button onClick={() => { setAnswered({...answered, [key]: true}); setCurC(Math.min(t.cards.length - 1, curC + 1)); }}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-md active:bg-blue-600">Далі</button>
        </div>
      </div>

      {/* Прогрес крапками */}
      <div className="flex justify-center gap-2 mt-6">
        {t.cards.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i === curC ? 'bg-blue-500' : (answered[`${curT}_${i}`] ? 'bg-green-400' : 'bg-gray-300')}`} />
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DanskApp />);
