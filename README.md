# Sisera CRM

Een moderne CRM webapplicatie voor winkel Sisera, gebouwd met React, TypeScript, Vite en TailwindCSS.

## 🚀 Features

- **Authenticatie**: Dummy login systeem met persistente sessie
- **Dashboard**: Overzicht van klantenstatistieken en recente activiteit
- **Klantenbeheer**: Volledig CRUD systeem voor klantendatabase
- **Responsive Design**: Werkt op desktop, tablet en mobiel
- **State Management**: Zustand voor efficiënte state management
- **TypeScript**: Volledige type safety

## 🛠️ Technologieën

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Icons**: Emoji (voor eenvoud)

## 📦 Installatie

1. Clone het project
2. Installeer dependencies:
   ```bash
   npm install
   ```

3. Start de development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in je browser

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



