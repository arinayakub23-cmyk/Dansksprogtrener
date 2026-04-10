useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);import { useState, useRef } from "react";
const topics = {
A: { icon: " ", label: "A: Arbejde", person: "Nanna er kok", cards: [
{ id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor","Hvilken"],
{ id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår",
{ id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvo
{ id:"frokost", label:"Frokostpause", scene:"Nanna har frokostpause midt på dagen.", wh:[
{ id:"løn", label:"Løn", scene:"Nanna tjener penge som kok på hotellet.", wh:["Hvor meget
{ id:"sprog", label:"Sprog/kolleger", scene:"Nanna taler dansk og arbejder med kolleger."
]},
B: { icon: " ", label: "B: Fritid", person: "Jonas går til fodbold", cards: [
{ id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor
{ id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken","Hvad he
{ id:"dage", label:"Dage/tid", scene:"Jonas går til fodbold på bestemte dage.", wh:["Hvor
{ id:"sam", label:"Sammen med", scene:"Jonas spiller fodbold med andre spillere.", wh:["H
{ id:"pris", label:"Pris", scene:"Det koster penge at spille i klubben.", wh:["Hvad koste
{ id:"trans", label:"Transport", scene:"Jonas kommer til træning på en bestemt måde.", wh
]},
C: { icon: " ", label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
{ id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvilken","Hvor"]
{ id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad","Hvilk
{ id:"rum", label:"Værelser", scene:"Huset har flere rum og måske en kælder.", wh:["Hvor
{ id:"have", label:"Have", scene:"Huset har en have.", wh:["Har de","Hvor stor"], hint:["
{ id:"nabo", label:"Naboer", scene:"John og Emma har naboer i nærheden.", wh:["Hvem","Hvo
{ id:"leje", label:"Husleje", scene:"De betaler husleje eller ejer huset.", wh:["Hvor meg
]},
D: { icon: " ", label: "D: Skole", person: "Karla går i skole", cards: [
{ id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor","Hvilken"],
{ id:"tid", label:"Dage/tid", scene:"Karla møder i skole på bestemte tider.", wh:["Hvornå
{ id:"elev", label:"Elever", scene:"Der er elever i Karlas klasse.", wh:["Hvor mange"], h
{ id:"laer", label:"Lærer", scene:"Karla har en eller flere lærere.", wh:["Hvad","Hvem","
{ id:"pause", label:"Pauser", scene:"Eleverne har pauser i løbet af skoledagen.", wh:["Hv
{ id:"trans", label:"Transport", scene:"Karla bruger en bestemt transport til skole.", wh
]},
E: { icon: " ", label: "E: Praktik", person: "Layla er i praktik", cards: [
{ id:"sted", label:"Sted/by", scene:"Layla er i praktik et sted i Danmark.", wh:["Hvor"],
{ id:"tid", label:"Arbejdstid", scene:"Layla arbejder på bestemte tidspunkter.", wh:["Hva
{ id:"opgv", label:"Arbejdsopgaver", scene:"Layla laver forskellige opgaver i praktikken.
{ id:"frok", label:"Frokostpause", scene:"Layla spiser i pausen i praktikken.", wh:["Hvad
{ id:"tran", label:"Transport", scene:"Layla bruger en bestemt transport til praktik.", w
{ id:"lang", label:"Hvor lang tid", scene:"Layla er i praktik i en bestemt periode.", wh:
]},
F: { icon: " ", label: "F: Fritid (zoo)", person: "Mille er i Zoologisk Have", cards: [
{ id:"by", label:"By", scene:"Mille besøger en zoologisk have i en by.", wh:["Hvilken","H
{ id:"tid", label:"Dage/tid", scene:"Mille er i zoo på en bestemt dag og tid.", wh:["Hvor
{ id:"sam", label:"Sammen med", scene:"Mille er i zoo med nogen.", wh:["Hvem"], hint:["Hv
{ id:"akt", label:"Aktiviteter", scene:"Der er aktiviteter og dyr i den zoologiske have."
{ id:"mad", label:"Mad/drikke", scene:"Mille spiser og drikker noget i zoo.", wh:["Hvad"]
{ id:"pris", label:"Pris", scene:"Det koster penge at komme ind i zoo.", wh:["Hvad koster
]},
};
const COLOR = {
god: { bg: "#EAF3DE", text: "#27500A", border: "#C0DD97" },
ok: { bg: "#FAEEDA", text: "#633806", border: "#FAC775" },
fejl:{ bg: "#FCEBEB", text: "#791F1F", border: "#F7C1C1" },
load:{ bg: "#F1EFE8", text: "#5F5E5A", border: "#D3D1C7" },
};
export default function App() {
const [curT, setCurT] = useState("A");
const [curC, setCurC] = useState(0);
const [answered, setAnswered] = useState({});
const [inputs, setInputs] = useState({});
const [feedback, setFeedback] = useState(null);
const [loading, setLoading] = useState(false);
const [showEx, setShowEx] = useState(false);
const taRef = useRef();
const t = topics[curT];
const c = t.cards[curC];
const key = curT + "_" + curC;
function selTopic(k) { setCurT(k); setCurC(0); setFeedback(null); setShowEx(false); }
function selCard(i) { setCurC(i); setFeedback(null); setShowEx(false); }
async function check() {
const val = (inputs[key] || "").trim();
if (!val) { setFeedback({ score: "fejl", simple: "Skriv venligst et spørgsmål først." });
setLoading(true);
setFeedback({ score: "load", simple: "AI tjekker dit spørgsmål..." });
const prompt = `Du er dansklærer. En elev øver sig i at stille spørgsmål på dansk til bil
Situation: "${c.scene}"
Tema: "${c.label}"
Elevens spørgsmål: "${val}"
Svar KUN med dette JSON (ingen markdown):
{
"score": "god" eller "ok" eller "fejl",
"relevant": true eller false,
"grammatik": "1 sætning om grammatikken",
"fejl": "beskriv fejl, ellers tom streng",
"forbedring": "korrekt version af spørgsmålet",
"ros": "kort ros hvis god, ellers tom streng"
}
score "god": korrekt dansk, relevant, spørgsmålstegn, rigtig ordstilling (hv-ord+verbum+subje
score "ok": forståeligt men mindre fejl
score "fejl": forkert grammatik, forkert ordstilling, mangler spørgsmålstegn, ikke relevant`;
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 400, messages:
});
const data = await res.json();
const raw = data.content.map(i => i.text || "").join("");
const j = JSON.parse(raw.replace(/```json|```/g, "").trim());
setAnswered(a => ({ ...a, [key]: true }));
setFeedback(j);
} catch {
setFeedback({ score: "fejl", simple: "Kunne ikke forbinde til AI. Prøv igen." });
}
setLoading(false);
}
function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check()
const col = feedback ? COLOR[feedback.score] || COLOR.load : null;
margin
return (
<div style={{ fontFamily: "system-ui, sans-serif", padding: "16px", maxWidth: 520, <div style={{ marginBottom: 14 }}>
<h1 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 3px" }}>Modultest.dk — spørg
<p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>AI tjekker grammatik og ords
</div>
{/* Topic nav */}
<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
{Object.entries(topics).map(([k, v]) => (
<button key={k} onClick={() => selTopic(k)} style={{
fontSize: 12, padding: "5px 12px", borderRadius: 999, cursor: "pointer",
border: "1px solid", transition: "all .15s",
background: k === curT ? "#EFF6FF" : "transparent",
borderColor: k === curT ? "#3B82F6" : "#d1d5db",
color: k === curT ? "#1D4ED8" : "#6b7280",
fontWeight: k === curT ? 600 : 400,
}}>{v.icon} {v.label}</button>
))}
</div>
{/* Progress dots */}
<div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
{t.cards.map((_, i) => {
const k2 = curT + "_" + i;
return (
<div key={i} onClick={() => selCard(i)} style={{
width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
background: answered[k2] ? "#10B981" : i === curC ? "#3B82F6" : "#d1d5db",
}} />
);
})}
</div>
paddin
}}>
{/* Card */}
<div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, {/* Header */}
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", displ
<div>
<div style={{ fontSize: 15, fontWeight: 600 }}>{c.label}</div>
<div style={{ fontSize: 12, color: "#6b7280" }}>{t.person} — kort {curC + 1} af {
</div>
</div>
{/* Situation */}
<div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 14px", marginBo
<div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: ".05e
<div style={{ fontSize: 14, color: "#111827", lineHeight: 1.55 }}>{c.scene}</div>
</div>
{/* Hint chips */}
<div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Hv-ord som hjælp:</d
<div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
{c.wh.map(w => (
<span key={w} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, back
))}
{c.hint.map(h => (
))}
</div>
<span key={h} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, back
{/* Input */}
<div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: <textarea
ref={taRef}
value={inputs[key] || ""}
onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
onKeyDown={handleKey}
placeholder="Skriv dit spørgsmål på dansk..."
style={{
flex: 1, minHeight: 50, resize: "vertical", fontSize: 15, padding: "9px 11px",
borderRadius: 10, border: "1px solid #d1d5db", fontFamily: "inherit",
outline: "none", lineHeight: 1.4,
10 }}>
}}
/>
<button onClick={check} disabled={loading} style={{
padding: "10px 16px", borderRadius: 10, border: "1px solid #d1d5db",
background: loading ? "#F3F4F6" : "#EFF6FF", color: loading ? "#9ca3af" : "#1D4ED
cursor: loading ? "default" : "pointer", fontSize: 14, fontWeight: 500, minWidth:
display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
}}>
{loading ? (
) : "Tjek"}
</button>
</div>
<span style={{ display: "inline-block", width: 14, height: 14, border: "2px sol
{/* Feedback */}
{feedback && (
<div style={{
padding: "12px 14px", borderRadius: 10, marginBottom: 10,
background: col.bg, color: col.text, border: `1px solid ${col.border}`,
fontSize: 14, lineHeight: 1.55,
}}>
{feedback.simple ? (
<span>{feedback.simple}</span>
) : (
<>
<div style={{ fontWeight: 600, marginBottom: feedback.grammatik || feedback.f
{feedback.score === "god" ? (feedback.ros || "Godt spørgsmål!") :
feedback.score === "ok" ? "Næsten rigtigt!" : "Prøv igen."}
{!feedback.relevant && " — spørgsmålet passer ikke til temaet."}
</div>
{feedback.grammatik && (
<div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTo
<div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase",
{feedback.grammatik}
</div>
)}
{feedback.fejl && (
<div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTo
<div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase",
{feedback.fejl}
</div>
)}
{feedback.forbedring && feedback.score !== "god" && (
<div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTo
<div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase",
<strong>{feedback.forbedring}</strong>
</div>
)}
</>
)}
</div>
)}
{/* Examples */}
<button onClick={() => setShowEx(v => !v)} style={{ fontSize: 13, color: "#6b7280", b
{showEx ? "Skjul eksempler" : "Vis eksempler"}
</button>
{showEx && (
<div style={{ marginTop: 8 }}>
{c.examples.map((ex, i) => (
<div key={i} style={{ fontSize: 13, color: "#6b7280", padding: "4px 0", borderB
<strong style={{ color: "#374151" }}>→</strong> {ex}
</div>
))}
</div>
)}
{/* Nav */}
<div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 14
<button onClick={() => selCard(curC - 1)} disabled={curC === 0} style={{
padding: "8px 14px", borderRadius: 10, border: "1px solid #d1d5db",
background: "transparent", cursor: curC === 0 ? "default" : "pointer",
fontSize: 14, opacity: curC === 0 ? .4 : 1,
}}>← Forrige</button>
<button onClick={() => selCard(curC + 1)} disabled={curC === t.cards.length - 1} st
padding: "8px 14px", borderRadius: 10, border: "none",
background: curC === t.cards.length - 1 ? "#d1d5db" : "#3B82F6",
color: "#fff", cursor: curC === t.cards.length - 1 ? "default" : "pointer",
fontSize: 14, fontWeight: 500,
}}>{curC === t.cards.length - 1 ? "Afslut ✓" : "Næste →"}</button>
</div>
</div>
<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
</div>
}
);
