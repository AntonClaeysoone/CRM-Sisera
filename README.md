# CRM Sisera

Een moderne CRM webapplicatie voor winkel Sisera en Boss, gebouwd met React, TypeScript, Vite en TailwindCSS.

[![GitHub](https://img.shields.io/badge/github-CRM--Sisera-blue.svg)](https://github.com/AntonClaeysoone/CRM-Sisera)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg)](https://supabase.com/)

## 🚀 Features

- **🏪 Shop Management**: Switch tussen Sisera en Boss winkels
- **👥 Customer Management**: Volledig CRUD systeem met Supabase integratie
- **📱 Customer Onboarding**: Modal-based klanten toevoegen
- **📊 Dashboard**: Overzicht van klantenstatistieken per winkel
- **🔍 Search & Filter**: Geavanceerd zoeken en filteren van klanten
- **💾 Supabase**: Real-time database integratie
- **🎨 Modern UI**: TailwindCSS met responsive design
- **⚡ Performance**: Vite build tool voor snelle development

## 🛠️ Technologieën

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v3
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **Authentication**: Supabase Auth (Ready)
- **Deployment**: GitHub + Vercel ready

## 📦 Installatie

1. **Clone het project**
   ```bash
   git clone https://github.com/AntonClaeysoone/CRM-Sisera.git
   cd CRM-Sisera
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   - Maak `.env` file aan in project root
   - Voeg je Supabase URL en anon key toe (zie ENVIRONMENT_SETUP.md)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in je browser

## 🔐 Demo Inloggegevens

- **E-mail**: admin@sisera.be
- **Wachtwoord**: admin123

## 📁 Project Structuur

```
src/
├── components/          # Herbruikbare UI componenten
│   └── layout/         # Layout componenten (DashboardLayout)
├── features/           # Feature-specifieke componenten
│   ├── auth/          # Authenticatie (LoginPage)
│   ├── dashboard/     # Dashboard functionaliteit
│   └── customers/     # Klantenbeheer
├── lib/               # Utilities en configuratie
│   └── stores/        # Zustand stores
├── types/             # TypeScript type definities
└── hooks/             # Custom React hooks
```

## 🎯 Functionaliteiten

### Dashboard
- Overzicht van klantenstatistieken
- Recente klanten lijst
- Snelle acties

### Klantenbeheer
- Klantenlijst met zoekfunctionaliteit
- Nieuwe klant toevoegen
- Klantgegevens bewerken
- Klant verwijderen
- Volledige klantgegevens (naam, e-mail, telefoon, adres, notities)

### Authenticatie
- Veilige login met dummy authenticatie
- Persistente sessie (localStorage)
- Automatische redirect naar dashboard na login

## 🚀 Build voor Productie

```bash
npm run build
```

De gebouwde bestanden worden opgeslagen in de `dist/` map.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview productie build
- `npm run lint` - Run ESLint

## 🔮 Toekomstige Uitbreidingen

- Echte API integratie
- Geavanceerde zoekfilters
- Export functionaliteit
- E-mail integratie
- Bestellingen beheer
- Rapportage systeem
- Multi-user ondersteuning
- Real-time updates

## 📄 Licentie

ISC License



