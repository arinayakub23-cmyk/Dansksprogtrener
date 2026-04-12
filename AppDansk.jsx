import { useState, useRef } from "react";

const topics = {
  A: { icon: "👩‍🍳", label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by",      label:"By",            scene:"Nanna arbejder i en by i Danmark.",                    wh:["Hvor","Hvilken"],          hint:["by","Danmark"],          examples:["Hvor arbejder Nanna?","Hvilken by arbejder Nanna i?"] },
    { id:"tid",     label:"Arbejdstid",    scene:"Nanna møder på arbejde klokken 7.",                    wh:["Hvornår","Hvad tid"],      hint:["klokken","møder"],       examples:["Hvornår møder Nanna på arbejde?","Hvad tid starter Nanna?"] },
    { id:"plads",   label:"Arbejdsplads",  scene:"Nanna arbejder på et hotel som kok.",                  wh:["Hvor","Hvad"],             hint:["hotel","kok"],           examples:["Hvor arbejder Nanna?","Hvad arbejder Nanna som?"] },
    { id:"frokost", label:"Frokostpause",  scene:"Nanna har frokostpause midt på dagen.",                wh:["Hvornår","Hvor lang tid"], hint:["pause","middag"],        examples:["Hvornår har Nanna frokostpause?","Hvor lang tid har Nanna pause?"] },
    { id:"løn",     label:"Løn",           scene:"Nanna tjener penge som kok på hotellet.",              wh:["Hvor meget","Hvad"],       hint:["tjener","løn"],          examples:["Hvor meget tjener Nanna?","Hvad tjener Nanna?"] },
    { id:"sprog",   label:"Sprog/kolleger",scene:"Nanna taler dansk og arbejder med kolleger.",          wh:["Hvilke","Hvem"],           hint:["sprog","kolleger"],      examples:["Hvilke sprog taler Nanna?","Hvem arbejder Nanna med?"] },
  ]},
  B: { icon: "⚽", label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted",  label:"Sted/by",     scene:"Jonas spiller fodbold i en by i Danmark.",      wh:["Hvor","Hvilken"],          hint:["by","spiller"],      examples:["Hvor spiller Jonas fodbold?","Hvilken by bor Jonas i?"] },
    { id:"klub",  label:"Klub",        scene:"Jonas er med i en fodboldklub.",                wh:["Hvilken","Hvad hedder"],   hint:["klub","fodbold"],    examples:["Hvilken klub er Jonas med i?","Hvad hedder Jonasklub?"] },
    { id:"dage",  label:"Dage/tid",    scene:"Jonas går til fodbold på bestemte dage.",       wh:["Hvornår","Hvilke dage"],   hint:["dage","træning"],    examples:["Hvornår går Jonas til fodbold?","Hvilke dage træner Jonas?"] },
    { id:"sam",   label:"Sammen med",  scene:"Jonas spiller fodbold med andre spillere.",     wh:["Hvem"],                    hint:["sammen","spillere"], examples:["Hvem spiller Jonas fodbold med?"] },
    { id:"pris",  label:"Pris",        scene:"Det koster penge at spille i klubben.",         wh:["Hvad koster","Hvor meget"],hint:["koster","betaler"],  examples:["Hvad koster det at spille i klubben?","Hvor meget betaler Jonas?"] },
    { id:"trans", label:"Transport",   scene:"Jonas kommer til træning på en bestemt måde.",  wh:["Hvordan","Hvad"],          hint:["transport","cykel"], examples:["Hvordan kommer Jonas til træning?","Hvad bruger Jonas til transport?"] },
  ]},
  C: { icon: "🏠", label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by",   label:"By",       scene:"John og Emma bor i en by i Danmark.",           wh:["Hvilken","Hvor"],          hint:["by","bor"],          examples:["Hvilken by bor John og Emma i?","Hvor bor John og Emma?"] },
    { id:"adr",  label:"Adresse",  scene:"Huset har adressen Landevejen 11.",             wh:["Hvad","Hvilken"],          hint:["adresse","gade"],    examples:["Hvad er adressen?","Hvilken adresse har huset?"] },
    { id:"rum",  label:"Værelser", scene:"Huset har flere rum og måske en kælder.",       wh:["Hvor mange"],              hint:["rum","kælder"],      examples:["Hvor mange rum har huset?","Har huset en kælder?"] },
    { id:"have", label:"Have",     scene:"Huset har en have.",                            wh:["Har de","Hvor stor"],      hint:["have","stor"],       examples:["Har de en have?","Hvor stor er haven?"] },
    { id:"nabo", label:"Naboer",   scene:"John og Emma har naboer i nærheden.",           wh:["Hvem","Hvor mange"],       hint:["naboer","nær"],      examples:["Hvem er naboerne?","Hvor mange naboer har de?"] },
    { id:"leje", label:"Husleje",  scene:"De betaler husleje eller ejer huset.",          wh:["Hvor meget","Ejer de"],    hint:["husleje","betaler"], examples:["Hvor meget betaler de i husleje?","Ejer de huset?"] },
  ]},
  D: { icon: "🎒", label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted",  label:"Sted/by",   scene:"Karla går i skole i en by.",                      wh:["Hvor","Hvilken"],          hint:["by","skole"],        examples:["Hvor går Karla i skole?","Hvilken by går Karla i skole i?"] },
    { id:"tid",   label:"Dage/tid",  scene:"Karla møder i skole på bestemte tider.",           wh:["Hvornår","Hvad tid"],      hint:["møder","tid"],       examples:["Hvornår møder Karla i skole?","Hvad tid starter skolen?"] },
    { id:"elev",  label:"Elever",    scene:"Der er elever i Karlas klasse.",                   wh:["Hvor mange"],              hint:["elever","klasse"],   examples:["Hvor mange elever er der i klassen?"] },
    { id:"laer",  label:"Lærer",     scene:"Karla har en eller flere lærere.",                 wh:["Hvad","Hvem","Hvor mange"],hint:["lærer","hedder"],    examples:["Hvad hedder Karlas lærer?","Hvem er Karlas lærer?"] },
    { id:"pause", label:"Pauser",    scene:"Eleverne har pauser i løbet af skoledagen.",       wh:["Hvornår","Hvor mange"],    hint:["pause","frikvarter"],examples:["Hvornår har eleverne pause?","Hvor mange pauser er der?"] },
    { id:"trans", label:"Transport", scene:"Karla bruger en bestemt transport til skole.",     wh:["Hvordan","Hvad"],          hint:["cykel","bus"],       examples:["Hvordan kommer Karla til skole?","Hvad bruger Karla til transport?"] },
  ]},
  E: { icon: "📋", label: "E: Praktik", person: "Layla er i praktik", cards: [
    { id:"sted",  label:"Sted/by",          scene:"Layla er i praktik et sted i Danmark.",               wh:["Hvor"],                    hint:["by","praktik"],      examples:["Hvor er Layla i praktik?"] },
    { id:"tid",   label:"Arbejdstid",       scene:"Layla arbejder på bestemte tidspunkter.",              wh:["Hvad tid","Hvornår"],       hint:["møder","slutter"],   examples:["Hvad tid møder Layla?","Hvornår slutter Layla?"] },
    { id:"opgv",  label:"Arbejdsopgaver",   scene:"Layla laver forskellige opgaver i praktikken.",        wh:["Hvad","Hvilke"],            hint:["opgaver","laver"],   examples:["Hvad laver Layla i praktikken?","Hvilke opgaver har Layla?"] },
    { id:"frok",  label:"Frokostpause",     scene:"Layla spiser i pausen i praktikken.",                  wh:["Hvad","Hvornår"],           hint:["spiser","pause"],    examples:["Hvad spiser Layla i pausen?","Hvornår holder Layla pause?"] },
    { id:"tran",  label:"Transport",        scene:"Layla bruger en bestemt transport til praktik.",        wh:["Hvordan","Hvad"],           hint:["bus","cykel"],       examples:["Hvordan kommer Layla til praktik?","Hvad bruger Layla?"] },
    { id:"lang",  label:"Hvor lang tid",    scene:"Layla er i praktik i en bestemt periode.",              wh:["Hvor lang tid","Hvornår"],  hint:["uger","måneder"],    examples:["Hvor lang tid er Layla i praktik?","Hvornår slutter praktikken?"] },
  ]},
  F: { icon: "🦁", label: "F: Fritid (zoo)", person: "Mille er i Zoologisk Have", cards: [
    { id:"by",   label:"By",          scene:"Mille besøger en zoologisk have i en by.",          wh:["Hvilken","Hvor"],          hint:["by","zoo"],          examples:["Hvilken by er den zoologiske have i?","Hvor er Mille?"] },
    { id:"tid",  label:"Dage/tid",    scene:"Mille er i zoo på en bestemt dag og tid.",           wh:["Hvornår","Hvilken dag"],    hint:["dag","tid"],         examples:["Hvornår er Mille i zoo?","Hvilken dag besøger Mille zoo?"] },
    { id:"sam",  label:"Sammen med",  scene:"Mille er i zoo med nogen.",                          wh:["Hvem"],                    hint:["med","familie"],     examples:["Hvem er Mille i zoo med?"] },
    { id:"akt",  label:"Aktiviteter", scene:"Der er aktiviteter og dyr i den zoologiske have.",   wh:["Hvad","Hvilke"],           hint:["dyr","aktiviteter"], examples:["Hvad kan man se i zoo?","Hvilke dyr er der?"] },
    { id:"mad",  label:"Mad/drikke",  scene:"Mille spiser og drikker noget i zoo.",               wh:["Hvad"],                    hint:["spiser","drikker"],  examples:["Hvad spiser Mille i zoo?","Hvad drikker Mille?"] },
    { id:"pris", label:"Pris",        scene:"Det koster penge at komme ind i zoo.",               wh:["Hvad koster","Hvor meget"],hint:["koster","billet"],   examples:["Hvad koster det at komme ind i zoo?","Hvor meget koster en billet?"] },
  ]},
};

const COLOR = {
  god:  { bg: "#EAF3DE", text: "#27500A", border: "#C0DD97" },
  ok:   { bg: "#FAEEDA", text: "#633806", border: "#FAC775" },
  fejl: { bg: "#FCEBEB", text: "#791F1F", border: "#F7C1C1" },
  load: { bg: "#F1EFE8", text: "#5F5E5A", border: "#D3D1C7" },
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
  function selCard(i)  { setCurC(i); setFeedback(null); setShowEx(false); }

  async function check() {
    const val = (inputs[key] || "").trim();
    if (!val) {
      setFeedback({ score: "fejl", simple: "Skriv venligst et spørgsmål først." });
      return;
    }
    setLoading(true);
    setFeedback({ score: "load", simple: "AI tjekker dit spørgsmål..." });

    const prompt = `Du er dansklærer. En elev øver sig i at stille spørgsmål på dansk til billeder.
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
score "god": korrekt dansk, relevant, spørgsmålstegn, rigtig ordstilling (hv-ord+verbum+subjekt)
score "ok": forståeligt men mindre fejl
score "fejl": forkert grammatik, forkert ordstilling, mangler spørgsmålstegn, ikke relevant`;

    try {
      // Kalder vores Vercel serverless funktion — GEMINI_API_KEY er gemt sikkert på serveren
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const raw = data.text || "";
      const j = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setAnswered(a => ({ ...a, [key]: true }));
      setFeedback(j);
    } catch {
      setFeedback({ score: "fejl", simple: "Kunne ikke forbinde til AI. Prøv igen." });
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); }
  }

  const col = feedback ? COLOR[feedback.score] || COLOR.load : null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "16px", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 3px" }}>Modultest.dk — spørgsmålstræner</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>AI tjekker grammatik og ordstilling i dit spørgsmål</p>
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

      {/* Card */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {t.icon}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{t.person} — kort {curC + 1} af {t.cards.length}</div>
          </div>
        </div>

        {/* Situation */}
        <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: ".05em", marginBottom: 3, textTransform: "uppercase" }}>Situation</div>
          <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.55 }}>{c.scene}</div>
        </div>

        {/* Hint chips */}
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Hv-ord som hjælp:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {c.wh.map(w => (
            <span key={w} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}>{w}</span>
          ))}
          {c.hint.map(h => (
            <span key={h} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: "#F3F4F6", color: "#6b7280", border: "1px solid #e5e7eb" }}>{h}</span>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
          <textarea
            ref={taRef}
            value={inputs[key] || ""}
            onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
            onKeyDown={handleKey}
            placeholder="Skriv dit spørgsmål på dansk..."
            style={{
              flex: 1, minHeight: 50, resize: "vertical", fontSize: 15, padding: "9px 11px",
              borderRadius: 10, border: "1px solid #d1d5db", fontFamily: "inherit",
              outline: "none", lineHeight: 1.4,
            }}
          />
          <button onClick={check} disabled={loading} style={{
            padding: "10px 16px", borderRadius: 10, border: "1px solid #d1d5db",
            background: loading ? "#F3F4F6" : "#EFF6FF",
            color: loading ? "#9ca3af" : "#1D4ED8",
            cursor: loading ? "default" : "pointer",
            fontSize: 14, fontWeight: 500, minWidth: 64,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            {loading ? (
              <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #9ca3af", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            ) : "Tjek"}
          </button>
        </div>

        {/* Feedback */}
        {feedback && col && (
          <div style={{
            padding: "12px 14px", borderRadius: 10, marginBottom: 10,
            background: col.bg, color: col.text, border: `1px solid ${col.border}`,
            fontSize: 14, lineHeight: 1.55,
          }}>
            {feedback.simple ? (
              <span>{feedback.simple}</span>
            ) : (
              <>
                <div style={{ fontWeight: 600, marginBottom: (feedback.grammatik || feedback.fejl) ? 6 : 0 }}>
                  {feedback.score === "god" ? (feedback.ros || "Godt spørgsmål! ✓") :
                   feedback.score === "ok"  ? "Næsten rigtigt! 🟡" : "Prøv igen. ✗"}
                  {!feedback.relevant && " — spørgsmålet passer ikke til temaet."}
                </div>
                {feedback.grammatik && (
                  <div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTop: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2, opacity: .7 }}>Grammatik</div>
                    {feedback.grammatik}
                  </div>
                )}
                {feedback.fejl && (
                  <div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTop: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2, opacity: .7 }}>Fejl</div>
                    {feedback.fejl}
                  </div>
                )}
                {feedback.forbedring && feedback.score !== "god" && (
                  <div style={{ borderTop: `1px solid ${col.border}`, paddingTop: 7, marginTop: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2, opacity: .7 }}>Korrekt version</div>
                    <strong>{feedback.forbedring}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Examples */}
        <button onClick={() => setShowEx(v => !v)} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 4 }}>
          {showEx ? "Skjul eksempler ▲" : "Vis eksempler ▼"}
        </button>
        {showEx && (
          <div style={{ marginTop: 8 }}>
            {c.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: 13, color: "#6b7280", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
                <strong style={{ color: "#374151" }}>→</strong> {ex}
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 14 }}>
          <button onClick={() => selCard(curC - 1)} disabled={curC === 0} style={{
            padding: "8px 14px", borderRadius: 10, border: "1px solid #d1d5db",
            background: "transparent", cursor: curC === 0 ? "default" : "pointer",
            fontSize: 14, opacity: curC === 0 ? .4 : 1,
          }}>← Forrige</button>
          <button onClick={() => selCard(curC + 1)} disabled={curC === t.cards.length - 1} style={{
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: curC === t.cards.length - 1 ? "#d1d5db" : "#3B82F6",
            color: "#fff", cursor: curC === t.cards.length - 1 ? "default" : "pointer",
            fontSize: 14, fontWeight: 500,
          }}>{curC === t.cards.length - 1 ? "Afslut ✓" : "Næste →"}</button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
