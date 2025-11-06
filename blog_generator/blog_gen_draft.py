import os
import openai
from bs4 import BeautifulSoup
import tkinter as tk
from tkinter import simpledialog
import subprocess
import requests        # för bildgenerering
import html
import pdfkit

############################################################
# 1. wkhtmltopdf‑hjälp
############################################################
def kontrollera_wkhtmltopdf() -> bool:
    """Returnerar True om wkhtmltopdf finns i PATH."""
    try:
        res = subprocess.run(
            ["wkhtmltopdf", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        return res.returncode == 0
    except FileNotFoundError:
        return False


def hitta_wkhtmltopdf() -> str | None:
    """Letar i några standard­kataloger efter wkhtmltopdf.exe."""
    platser = [
        r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe",
        r"C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe",
        r"C:\wkhtmltopdf\bin\wkhtmltopdf.exe",
        rf"{os.environ.get('LOCALAPPDATA', 'C:/Users/Propietario/AppData/Local')}\Programs\wkhtmltopdf\bin\wkhtmltopdf.exe",
    ]
    for p in platser:
        if os.path.exists(p):
            return p
    return None


############################################################
# 2. Data‑hjälpare
############################################################
def läs_html_filer(path: str):
    """Returnerar [(filnamn, förenklad struktur)] för alla .html i path."""
    data = []
    for fil in os.listdir(path):
        if fil.lower().endswith(".html"):
            with open(os.path.join(path, fil), "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
            rub = [h.get_text() for h in soup.find_all(["h1", "h2", "h3"])]
            para = [p.get_text() for p in soup.find_all("p")]
            data.append(
                (
                    fil,
                    "Rubriker:\n"
                    + "\n".join(rub)
                    + "\n\nParagrafer (första 200 tecken):\n"
                    + "\n".join(p[:200] for p in para)
                )
            )
    return data


def läs_tonalitet_filer(path: str) -> str:
    """Slår ihop alla .txt‑filer i mappen till en sträng."""
    return "\n\n".join(
        open(os.path.join(path, f), "r", encoding="utf-8").read()
        for f in os.listdir(path)
        if f.lower().endswith(".txt")
    )


def skapa_prompt(html_data, ton, sub):
    struktur = "".join(f"\nFIL: {f}\n{s}\n" for f, s in html_data)
    return f"""
Du är en skicklig svensk skribent i samma stil som dessa texter:
--- TONALITET START ---
{ton}
--- TONALITET SLUT ---

Ta hänsyn till HTML‑strukturen nedan:
--- HTML STRUKTUR START ---
{struktur}
--- HTML STRUKTUR SLUT ---

Skriv ~1000 ord (svenska) om Longevity med fokus på "{sub}".
Använd <h1>, <h2> och <p> i strukturen.
"""


def generera_meta_beskrivning(sub: str) -> str:
    prompt = (
        f"Skriv en SEO‑optimerad meta‑beskrivning (≤155 tecken) "
        f"för en Longevity‑artikel om '{sub}'."
    )
    try:
        r = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=80,
        )
        meta = r.choices[0].message.content.strip().strip("\"'")
        meta = html.unescape(meta)
        return (meta[:137] + "…") if len(meta) > 140 else meta
    except Exception:
        return f"Longevity – upptäck hur {sub} kan förlänga ett friskt liv. Läs mer!"


def generera_bild(sub: str) -> str | None:
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return None

    payload = {
        "model": "dall-e-3",
        "prompt": f"Illustration av {sub} relaterat till Longevity, naturlig stil",
        "n": 1,
        "size": "1024x1024",
        "quality": "hd",
    }
    try:
        r = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers={"Authorization": f"Bearer {key}"},
            json=payload,
        )
        r.raise_for_status()
        url = r.json()["data"][0]["url"]

        img = requests.get(url)
        img.raise_for_status()

        safe = "".join(c if c.isalnum() else "_" for c in sub)
        fn = f"longevity_{safe}.png"
        folder = r"C:\Users\Propietario\Desktop\Ulrika\nyheter"
        os.makedirs(folder, exist_ok=True)
        fp = os.path.join(folder, fn)
        open(fp, "wb").write(img.content)
        return fp
    except Exception:
        return None


def skapa_seo_data(html_txt: str, sub: str, meta: str):
    soup = BeautifulSoup(html_txt, "html.parser")

    title = soup.find("h1").get_text(strip=True) if soup.find("h1") else f"Longevity: {sub}"

    slug = (
        "longevity-" + "_".join(sub.lower().split()[:3])
        .replace("å", "a")
        .replace("ä", "a")
        .replace("ö", "o")
    )

    keywords = ["longevity", sub.lower()] + [
        w
        for h in soup.find_all("h2")
        for w in h.get_text().lower().split()
    ]
    stop = {"och", "att", "det", "i", "på", "är", "en", "som", "med", "för"}
    keywords = ", ".join(dict.fromkeys([k for k in keywords if k not in stop]))[:255]

    return {
        "title": title,
        "meta_description": meta,
        "handle": slug,
        "keywords": keywords,
    }


############################################################
# 3. Shopify‑publicering
############################################################
def publicera(shop_html: str, sub: str, img: str | None, meta: str):
    import shopify, datetime, base64

    seo = skapa_seo_data(shop_html, sub, meta)

    shopify.ShopifyResource.set_site(
        "https://a83298503ea318ac7396ed78b17f43e7:"
        "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"
        "@1tmiwd-eq.myshopify.com/admin/api/2023-01"
    )

    art = shopify.Article()
    art.blog_id = 117283455321
    art.title = seo["title"]
    art.body_html = shop_html
    art.published = True
    art.published_at = datetime.datetime.now().isoformat()
    art.handle = seo["handle"]

    # inbyggda SEO‑fält
    art.title_tag = seo["title"]
    art.description_tag = seo["meta_description"]

    art.summary_html = seo["meta_description"]

    art.metafields = [
        {
            "namespace": "seo",
            "key": "keywords",
            "value": seo["keywords"],
            "type": "single_line_text_field",
        }
    ]

    if img and os.path.exists(img):
        art.image = {
            "attachment": base64.b64encode(open(img, "rb").read()).decode(),
            "alt": seo["title"],
        }

    if art.save():
        print("✅ Publicerad:",
              f"https://1tmiwd-eq.myshopify.com/blogs/nyheter/{art.handle}")
    else:
        print("🚫 Fel:", art.errors.full_messages())


############################################################
# 4. main
############################################################
def main():
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY saknas")
        return

    base = r"C:\Users\Propietario\Desktop\Ulrika\nyheter"
    html_dir = os.path.join(base, "artiklar")
    ton_dir = os.path.join(base, "tonalitet")

    if not (os.path.isdir(html_dir) and os.path.isdir(ton_dir)):
        print("Källmappar saknas")
        return

    # fråga användaren efter subämne
    root = tk.Tk()
    root.withdraw()
    subämne = simpledialog.askstring(
        "Subämne", "Vilket subämne inom Longevity?")
    if not subämne:
        print("Ingen input – avbryter.")
        return

    # samla in data
    html_data = läs_html_filer(html_dir)
    ton_text = läs_tonalitet_filer(ton_dir)

    # GPT‑artikel
    prompt = skapa_prompt(html_data, ton_text, subämne)
    chat = openai.ChatCompletion.create(
        model="gpt-4.5-preview",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2500,
    )
    artikel_raw = chat.choices[0].message.content

    # ta bort ev. <img>
    soup = BeautifulSoup(artikel_raw, "html.parser")
    for tag in soup.find_all("img"):
        tag.decompose()
    artikel = str(soup)

    # fullständig HTML
    html_doc = f"""<!DOCTYPE html>
<html lang='sv'>
<head>
  <meta charset='utf-8'>
  <title>Artikel om Longevity: {subämne}</title>
  <style>
    body{{font-family:Arial, sans-serif; line-height:1.6; max-width:800px; margin:0 auto; padding:20px;}}
    h1{{color:#2c3e50;}}
    h2{{color:#3498db;}}
    img{{max-width:100%; height:auto;}}
  </style>
</head>
<body>
{artikel}
</body>
</html>"""

    # spara HTML
    html_path = os.path.join(base, "artikel_longevity.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_doc)
    print("💾 HTML sparad:", html_path)

    # spara PDF (om wkhtmltopdf finns)
    pdf_path = os.path.join(base, "artikel_longevity.pdf")
    wkhtml_path = None
    if not kontrollera_wkhtmltopdf():
        wkhtml_path = hitta_wkhtmltopdf()
    try:
        if kontrollera_wkhtmltopdf() or wkhtml_path:
            pdfkit.from_file(
                html_path,
                pdf_path,
                options={"enable-local-file-access": "", "quiet": ""},
                configuration=pdfkit.configuration(wkhtmltopdf=wkhtml_path)
                if wkhtml_path
                else None,
            )
            print("📄 PDF sparad:", pdf_path)
        else:
            print("wkhtmltopdf saknas – hoppar över PDF.")
    except Exception as e:
        print("Fel vid PDF‑skapande:", e)

    # generera bild + meta
    bild = generera_bild(subämne)
    meta = generera_meta_beskrivning(subämne)

    # publicera
    publicera(html_doc, subämne, bild, meta)


if __name__ == "__main__":
    main()

