const { useState, useEffect, useRef } = React;

const topics = {
  A: { label: "A: Arbejde", person: "Nanna er kok", cards: [
    { id:"by", label:"By", scene:"Nanna arbejder i en by i Danmark.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Arbejdstid", scene:"Nanna møder på arbejde klokken 7.", wh:["Hvornår"] },
    { id:"plads", label:"Arbejdsplads", scene:"Nanna arbejder på et hotel som kok.", wh:["Hvor"] }
  ]},
  B: { label: "B: Fritid", person: "Jonas går til fodbold", cards: [
    { id:"sted", label:"Sted/by", scene:"Jonas spiller fodbold i en by i Danmark.", wh:["Hvor"] },
    { id:"klub", label:"Klub", scene:"Jonas er med i en fodboldklub.", wh:["Hvilken"] }
  ]},
  C: { label: "C: Bolig", person: "John og Emma bor i et hus", cards: [
    { id:"by", label:"By", scene:"John og Emma bor i en by i Danmark.", wh:["Hvilken","Hvor"] },
    { id:"adr", label:"Adresse", scene:"Huset har adressen Landevejen 11.", wh:["Hvad","Hvilken"] }
  ]},
  D: { label: "D: Skole", person: "Karla går i skole", cards: [
    { id:"sted", label:"Sted/by", scene:"Karla går i skole i en by.", wh:["Hvor","Hvilken"] },
    { id:"tid", label:"Dage/tid", scene:"Karla møder i skole на bestemte tider.", wh:["Hvornår"] }
  ]},
  E: { label: "E: Praktik", person: "Layla er i praktik", cards: [
    { id:"sted", label:"Sted/by", scene:"Layla er i praktik et sted i Danmark.", wh:["Hvor"] },
    { id:"opgv", label:"Opgaver", scene:"Layla laver forskellige opgaver i praktikken.", wh:["Hvilke"] }
  ]},
  F: { label: "F: Fritid (zoo)", person: "Mille er i Zoologisk Have", cards: [
    { id:"by", label:"By", scene:"Mille besøger en zoologisk have i en by.", wh:["Hvilken"] },
    { id:"pris", label:"Pris", scene:"Det koster penge at komme ind i zoo.", wh:["Hvad"] }
  ]}
};

// ... далі залишайте іншу частину коду (DanskApp функція та render)
