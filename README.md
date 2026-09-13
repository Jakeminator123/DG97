# DG97 office website

Website for the DG97 office space in Stockholm. The repository contains the Next.js site, reusable UI components, editorial content, administration setup and a separate blog-generation tool.

## Project status

This is the repository connected to the Vercel project `dg-97` in the account review of 13 September 2026. It is the main office-site codebase to use for maintenance. Other office-site design drafts should be evaluated separately before any code is moved here.

## Repository guide

- [`pages/`](pages/), [`components/`](components/) and [`styles/`](styles/): website pages and UI.
- [`content/`](content/): editorial content.
- [`blog_generator/`](blog_generator/): supporting content-generation tooling.
- [`ADMIN_SETUP.md`](ADMIN_SETUP.md): administration setup.
- [`scripts/`](scripts/): maintenance checks, including image checks.

## Local development

Use the Node.js range in `package.json`, then run `npm ci` and `npm run dev`. Build with `npm run build`. Configuration and local data should remain specific to the environment where the site runs.
