# Admin Backoffice Setup Guide

## Översikt

Adminpanelen finns på `/admin` och ger fullständig kontroll över:
- Blogg (generera, redigera, ta bort inlägg)
- Newsletter (prenumeranter, skicka nyhetsbrev)
- Innehåll (redigera texter på sidan)
- Bilder (ladda upp och hantera bilder)
- Autoposting (schemalägg bloggposter)

## Installation

1. Installera dependencies:
```bash
npm install
```

2. Skapa `.env` fil med:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ditt_säkra_lösenord
OPENAI_API_KEY=din_openai_key  # För blog-generator
```

## Användning

### Logga in
1. Gå till `/admin`
2. Logga in med dina credentials från `.env`

### Blogg-hantering
- **Generera**: Välj kategori och ämne, klicka "Generera & Publicera"
- **Redigera**: Klicka på ett inlägg i "Hantera Inlägg" (kommer snart)
- **Ta bort**: Klicka "Ta bort" på ett inlägg

### Newsletter
- **Visa prenumeranter**: Gå till "Newsletter"-fliken
- **Skicka**: Klicka "Skicka Newsletter", fyll i ämne och innehåll
- **Exportera**: Klicka "Exportera CSV" för att ladda ner prenumerantlistan

### Innehåll
- Gå till "Innehåll"-fliken
- Redigera texter och klicka "Spara" på varje fält

### Bilder
- Gå till "Bilder"-fliken
- Klicka "Ladda upp bild" och välj fil
- Kopiera URL:en för att använda bilden

## Data-lagring

All data sparas i filer:
- `data/newsletter_subscribers.json` - Prenumeranter
- `data/newsletter_history.json` - Skickhistorik
- `data/site_content.json` - Redigerbart innehåll
- `content/posts/*.md` - Blogginlägg
- `public/uploads/*` - Uppladdade bilder
- `blog_generator/schedule.json` - Autoposting-scheman

## Säkerhet

- Admin-routes är skyddade med HttpOnly cookies
- Alla API-endpoints kräver autentisering
- Lösenord lagras i `.env` (aldrig i kod)

## Troubleshooting

**Kan inte logga in:**
- Kontrollera att `ADMIN_USERNAME` och `ADMIN_PASSWORD` är satta i `.env`
- Starta om dev-servern efter att ha ändrat `.env`

**Blog-generator fungerar inte:**
- Kontrollera att `OPENAI_API_KEY` är satt
- Se till att Python är installerat och tillgängligt i PATH

**Bilder laddas inte upp:**
- Kontrollera att `public/uploads/` mappen finns och är skrivbar
- Max filstorlek är 10MB

