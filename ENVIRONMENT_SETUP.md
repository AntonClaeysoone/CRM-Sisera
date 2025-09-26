# Environment Setup

## Supabase Configuration

Om de applicatie te gebruiken, moet je eerst je Supabase environment variabelen instellen.

### Stap 1: .env bestand maken

Maak een `.env` bestand aan in de root directory van het project:

```bash
touch .env
```

### Stap 2: Supabase gegevens toevoegen

Voeg de volgende variabelen toe aan je `.env` bestand:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Waar vind je deze waarden:**

1. Ga naar je Supabase project dashboard
2. Ga naar **Settings** → **API**
3. Copy de **Project URL** (dit wordt VITE_SUPABASE_URL)
4. Copy de **anon public** key (dit wordt VITE_SUPABASE_ANON_KEY)

### Stap 3: Database Migrations uitvoeren

Run de migrations om de customers tabel aan te maken:

```bash
# Via Supabase CLI
supabase db reset
# of
supabase migration up

# Of via de Supabase dashboard SQL editor:
# 1. Ga naar Table Editor → SQL Editor
# 2. Run de migration files om de customers tabel te maken
# 3. Maak zeker dat RLS is uitgeschakeld voor development
```

### Stap 4: RLS (Row Level Security) Configuratie

**Voor Development (aanbevolen):**
1. Ga naar je Supabase dashboard
2. Ga naar **Authentication** → **Policies**
3. Voor de `customers` tabel: **Disable RLS** 
4. Als alternatief, maak een policy die anon toegang geeft

**Tijdelijk uitschakelen RLS:**
```sql
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
```

### Stap 5: Environment variabelen laden

Herstart je development server zodat de environment variabelen geladen worden:

```bash
npm run dev
```

## Troubleshooting

### "401 Unauthorized" Error:
1. **RLS Check**: Ga naar je Supabase dashboard → Authentication → Policies
2. **Disable RLS** op de customers tabel voor development
3. **Of maak een policy** die anon toegang geeft
4. Check je API keys en URL zijn correct

### Environment Variables Errors:
1. Controleer of je `.env` bestand in de root directory staat
2. Zorg dat de variabele namen exact kloppen (VITE_SUPABASE_URL, niet SUPABASE_URL)
3. Herstart de development server na toevoegen van env variabelen
4. Check of er geen spaties zijn rond de = tekenen in je .env bestand

### Migration Errors:
1. Check of je database bij Supabase actief is
2. Run de migrations via Supabase dashboard SQL editor
3. Controleer of de `customers` tabel bestaat
4. Probeer de **Debug Tool** in de dashboard om te testen
