const { useState, useEffect, useRef } = React;

// AIzaSyAWjyD7LuK5KBhEi7y03HIbjYg2EjL6F50
const API_KEY = "AIzaSyAWjyD7LuK5KBhEi7y03HIbjYg2EjL6F50"; 

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
    { id:"rum", label:"Værelser", scene:"Huset har flere rum.", wh:["Hvor mange"] },
    { id:"have", label:"Have", scene:"Huset har en have.", wh:["Hvor stor","Har de"] },
    { id:"nabo", label:"Naboer", scene:"John og Emma har naboer.", wh:["Hvem"] },
    { id:"leje", label:"Husleje", scene:"De betaler husleje.", wh:["Hvor meget"] }
  ]},
  D: { label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Dage/tid", scene:"Karla møder i skole на bestemte tider.", wh:["Hvornår"] },
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
    Svar kort на dansk. Hvis der er fejl, så forklar hvorfor og giv den korrekte version.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{
