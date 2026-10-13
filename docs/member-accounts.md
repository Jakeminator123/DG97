# Konton på dg97.org

Konton på dg97.org är egna webbplatskonton. De bekräftar innehavarens e-postadress och ger en kontosida med den egna profilen och offentliga kontaktvägar. Kontot är inte en bekräftelse på hyresgäststatus. Inga avtal, bokningar eller privata kontorshandlingar exponeras.

## Drift

- Managed Neon Auth håller användare, lösenord och sessioner i det separata DG97-projektet. Webbplatsen hanterar inga egna lösenordshashar.
- Servervariabeln `NEON_AUTH_BASE_URL` pekar på projektets riktiga auth-endpoint. Inga nycklar eller inloggningsuppgifter skickas till klienten. Integrationen använder tjänstens dokumenterade HTTP-API eftersom Next.js 15/Pages Router inte matchar det nuvarande Neon Next.js SDK:s Next.js 16-krav.
- `/api/auth/[...path]` tillåter endast de åtta behövda session-, inloggnings-, registrerings-, verifierings- och återställningsvägarna. Ändringar kräver JSON och samma tillåtna origin. Inget generellt admin- eller OAuth-proxy finns.
- Sessionscookies är signerade av tjänsten, HttpOnly, Secure i produktion och SameSite=Lax. Upstream-domän tas bort. Tokens och roller skickas inte i JSON till webbläsaren.
- Kontosidan verifierar den riktiga sessionen på servern för varje request och kräver bekräftad e-post. Skyddad data får inte läggas till enbart baserat på ett publikt registrerat konto; det kräver separat behörighetskontroll.

## Neon-konfiguration

Aktivera email/password samt obligatorisk e-postverifiering med sexsiffrig kod. Registrera produktionsdomäner och relevanta previews som trusted domains. Aktivera ingen social OAuth utan egna produktionsuppgifter.

Neons delade e-postleverantör stöder verifieringskoder och lösenordsåterställning, men är avsedd för utveckling/test och har delade sändningsgränser. Neons produktionschecklista kräver en egen SMTP-leverantör före bred användning. Dokumentera detta som ett kvarstående driftskrav tills egna SMTP-uppgifter har konfigurerats; lova inte obegränsad leverans.

## Verifiering

Verifiera riktig registrering → e-postkod → inloggning → omladdning med kvarvarande session → utloggning → nekad direktåtkomst. Kontrollera även lösenordsåterställning med e-postkod, felaktig kod och felaktigt lösenord. Ett enhetstest med mockad tjänst ersätter inte leverans av verkliga mejl.

Primärkällor: [Neon Email OTP](https://neon.com/docs/auth/guides/plugins/email-otp), [e-postverifiering](https://neon.com/docs/auth/guides/email-verification), [produktionschecklista](https://neon.com/docs/auth/production-checklist), [Better Auth Email OTP-källkod](https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/plugins/email-otp/routes.ts).
