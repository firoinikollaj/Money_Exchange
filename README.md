# 💱 Money Exchange

**Money Exchange** është një aplikacion web i ndërtuar për të simuluar një sistem këmbimi valutor. Projekti është zhvilluar si pjesë e një detyre kursi dhe përdor teknologji moderne për ndarjen e arkitekturës në frontend, backend dhe bazë të dhënash.

## 📌 Funksionalitetet

- Regjistrim dhe hyrje në sistem për përdoruesit
- Ndarje e roleve në: **admin** dhe **user i thjeshtë**
- Përdoruesi i thjeshtë:
  - Konverton valutën nga një monedhë në tjetrën
  - Shikon grafikët për ndryshimet e kursit të këmbimit
- Admini:
  - Krijon, modifikon, fshin dhe kërkon përdorues nëpërmjet query-ve
- Ruajtje e sigurt e të dhënave të përdoruesit dhe historikut të veprimeve

## 🛠 Teknologjitë e përdorura

- ⚙️ **Backend:** .NET (C#)
- 🌐 **Frontend:** React.js
- 🗄 **Database:** SQL Server
- 🔐 **Autentikim:** JWT ose session-based (varësisht implementimit)
- 🗃 **Kontroll versioni:** Git & GitHub

## 🧑‍💻 Rolet e përdoruesve

### 👤 User i thjeshtë:
- Mund të bëjë konvertime valutash
- Ka qasje në grafikët informues mbi kursin

### 👨‍💼 Admin:
- Mund të krijojë, fshijë dhe modifikojë përdoruesit
- Mund të kërkojë përdorues përmes query-ve në databazë

## 🔐 Login & Regjistrim

- Regjistrimi përfshin verifikim të email-it dhe ruajtje të sigurt të fjalëkalimit me hashing (bcrypt ose të ngjashëm)
- Login verifikon kredencialet dhe gjeneron token për autentikim (JWT)
- Përdoruesit kanë qasje të ndryshme në bazë të rolit të tyre

## 🚀 Instalimi dhe përdorimi

1. **Klono repository-n:**

```bash
git clone https://github.com/firoinikollaj/Money_Exchange.git

Backend (.NET):

Navigo në folderin e backend-it dhe hap projektin në Visual Studio

Konfiguro lidhjen me databazën në appsettings.json

Run aplikacionin nga Visual Studio

Frontend (React):

Navigo në folderin client ose frontend

Instalimi i varësive:

bash
Copy
Edit
npm install
