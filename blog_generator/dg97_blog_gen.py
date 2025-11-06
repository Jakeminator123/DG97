"""
DG97 Blog Generator
Smart blog post generator for DG97 kontorshotell
Generates markdown posts with AI-generated images
"""

import os
from datetime import datetime
import requests
from dotenv import load_dotenv

############################################################
# Configuration
############################################################
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

# Load .env from project root
dotenv_path = os.path.join(PROJECT_ROOT, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print(f"✓ Loaded .env from: {dotenv_path}")
else:
    print(f"⚠️  No .env file found at: {dotenv_path}")

POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")
IMAGES_DIR = os.path.join(PROJECT_ROOT, "public", "images", "blog")
EXISTING_POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")

# Ensure directories exist
os.makedirs(POSTS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

############################################################
# Topic Bank
############################################################
KONTORSHOTELL_TOPICS = {
    "startup": [
        "Varför startups väljer kontorshotell framför hemmakontor",
        "5 saker varje startup behöver från sitt kontor",
        "Hur kontorshotell hjälper startups att växa snabbare",
        "Budget-tips för startups som söker kontor i Stockholm",
        "Nätverkande för startups på kontorshotell"
    ],
    "produktivitet": [
        "Vetenskapen bakom produktivitet på kontorshotell",
        "Hur du skapar den perfekta arbetsrutinen på kontoret",
        "5 produktivitets-hacks för småföretagare",
        "Fokuserat arbete vs öppna kontorslandskap",
        "Telefonbås och fokuszoner - varför de är viktiga"
    ],
    "arbetsliv": [
        "Work-life balance som egenföretagare",
        "Varför hemarbete inte passar alla",
        "Mentala hälsofördelar med ett dedikerat kontor",
        "Att separera jobb och hem - en guide",
        "Sociala aspekter av kontorshotell"
    ],
    "ekonomi": [
        "Den dolda kostnaden av hemmakontor",
        "ROI av kontorshotell för småföretag",
        "Skattemässiga fördelar med kontorshotell",
        "Att budgetera för kontor som nystartat företag",
        "Jämförelse: coworking vs kontorshotell vs eget kontor"
    ],
    "stockholm": [
        "Bästa områdena för kontor i Stockholm 2024",
        "Vasastans charm för företagare",
        "Stockholm kontorshotell guide",
        "Pendling vs centralt läge - vad är värt priset?",
        "Drottninggatan som företagsadress"
    ],
    "nätverk": [
        "Hur man nätverkar naturligt på kontorshotell",
        "Skapa meningsfulla affärskontakter",
        "Introvert? Så här nätverkar du ändå",
        "Community-driven tillväxt",
        "5 nätverksevent att arrangera på ditt kontorshotell"
    ]
}

############################################################
# Read existing posts for tone analysis
############################################################
def analyze_existing_posts():
    """Read existing DG97 posts to understand tone and style"""
    posts_content = []

    try:
        if os.path.exists(EXISTING_POSTS_DIR):
            for filename in os.listdir(EXISTING_POSTS_DIR):
                if filename.endswith('.md'):
                    filepath = os.path.join(EXISTING_POSTS_DIR, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Extract just the content part (skip frontmatter)
                        if '---' in content:
                            parts = content.split('---', 2)
                            if len(parts) >= 3:
                                posts_content.append(parts[2][:1000])  # First 1000 chars
    except Exception as e:
        print(f"⚠️  Could not analyze existing posts: {e}")

    return "\n\n---\n\n".join(posts_content) if posts_content else ""

############################################################
# Generate content
############################################################
def create_prompt(title, category, existing_tone):
    """Create GPT prompt for blog post generation"""

    tone_instruction = ""
    if existing_tone:
        tone_instruction = f"""
Ta inspiration från tonen och stilen i dessa befintliga artiklar:
--- BEFINTLIGA ARTIKLAR START ---
{existing_tone}
--- BEFINTLIGA ARTIKLAR SLUT ---
"""

    return f"""Du är AIda, en erfaren kontorsassistent och skribent på DG97 kontorshotell i Stockholm.
Du har jobbat med kontorshotell i 8 år och känner branschen väl.

{tone_instruction}

Skriv en personlig, naturlig och engagerande bloggpost om:
"{title}"

Kategori: {category}

VIKTIGT - GÖR TEXTEN MÄNSKLIG:
- Skriv som en verklig person, inte som AI
- Använd personliga reflektioner och erfarenheter från DG97
- Inkludera små anekdoter eller konkreta exempel från verkliga situationer
- Variera meningslängder (korta och långa)
- Använd naturliga övergångar och kollokviala uttryck
- Inkludera retoriska frågor
- Lite humor där det passar
- Undvik AI-clichés som "I dagens digitala värld", "Det är viktigt att notera"
- Skriv som du pratar - naturligt och avslappnat men professionellt

SEO-OPTIMERING:
- Använd huvudkeyword (relaterat till {title}) naturligt i text
- Inkludera LSI-keywords (semantiskt relaterade ord)
- Intern länkning till relevanta DG97-sidor: /kontakt, /om-oss, /colocate
- Skriv för featured snippets (svara på konkreta frågor)
- Optimera för "People Also Ask"
- Använd long-tail keywords naturligt

STRUKTUR (800-1200 ord):
# Huvudrubrik (H1) - innehåller main keyword

Inledande stycke (hook som fångar läsaren direkt - kanske en fråga eller överraskande fact)

## Underrubrik med keyword-variant (H2)
Praktiskt innehåll med konkreta exempel från DG97-verksamheten.

### Detaljerad punkt (H3)
Djupdykning med specifika detaljer.

## [Relaterad underrubrik] (H2)
Mer praktisk info, inkludera listor där det passar.

## Tips från AIda / Personliga reflektioner (H2)
Dela med dig av erfarenheter, ge personliga råd.

## Vanliga frågor / Slutsats (H2)
Sammanfatta och ge naturlig CTA till DG97.

STIL-EXEMPEL (skriv så här):
"Efter att ha arbetat på DG97 i flera år har jag sett hur..."
"En av våra hyresgäster berättade nyligen att..."
"Jag brukar alltid säga till nya företag som kommer hit att..."
"Förra veckan hände något intressant - en startup som..."

UNDVIK:
❌ "Det är viktigt att notera"
❌ "I dagens snabbrörliga värld"
❌ "Som vi alla vet"
❌ "Det går inte att överskatta vikten av"
❌ Överdrivet formellt eller akademiskt språk

INKLUDERA:
✓ Konkreta siffror och exempel
✓ Personliga observationer
✓ Praktiska tips som faktiskt funkar
✓ Lokala referenser (Stockholm, Vasastan, Drottninggatan)
✓ Små detaljer som gör det trovärdigt

Börja direkt med markdown-innehållet (ingen frontmatter).
Skriv som AIda - erfaren, hjälpsam, personlig men professionell.
"""

def generate_blog_post(title, category):
    """Generate blog post using GPT"""
    print(f"🤖 Generating blog post: {title}")

    existing_tone = analyze_existing_posts()
    prompt = create_prompt(title, category, existing_tone)

    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2500,
        )

        content = response.choices[0].message.content.strip()
        return content

    except Exception as e:
        print(f"❌ Error generating content: {e}")
        return None

############################################################
# Meta generation
############################################################
def generate_meta_description(title):
    """Generate SEO meta description"""
    prompt = f"""Skriv en SEO-optimerad meta-beskrivning (max 155 tecken)
för en bloggpost med titeln: "{title}"

Skriv från AIda's perspektiv (kontorsassistent på DG97).
Gör den mänsklig, engagerande och inkludera "DG97" eller "Stockholm".
Använd active voice och inkludera ett "call to action".
Undvik AI-clichés.

Svara bara med meta-beskrivningen, inget annat."""

    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=60,
        )

        meta = response.choices[0].message.content.strip().strip('"\'')
        return meta[:155] if len(meta) > 155 else meta

    except Exception:
        return f"{title[:100]}... Läs mer om kontorshotell på DG97!"

############################################################
# Image generation
############################################################
def generate_image(title, category):
    """Generate blog post image using DALL-E"""
    print(f"🎨 Generating image for: {title}")

    # Create descriptive prompt
    image_prompts = {
        "startup": "Modern bright office space with young entrepreneurs working, natural light, Stockholm style, professional photography",
        "produktivitet": "Focused professional working at clean desk, minimalist office, calm atmosphere, natural lighting",
        "arbetsliv": "Balanced workspace showing comfortable office environment, plants, coffee, welcoming atmosphere",
        "ekonomi": "Professional business setting, calculator and documents, modern office, clean aesthetic",
        "stockholm": "Stockholm city view, modern office building, Vasastan area, professional photography",
        "nätverk": "Diverse professionals networking in modern lounge space, casual meeting, warm atmosphere"
    }

    base_prompt = image_prompts.get(category, "Modern professional office space, bright and welcoming")
    full_prompt = f"{base_prompt}, high quality, 4k, professional photography, for blog post about '{title}'"

    try:
        from openai import OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("⚠️  No OPENAI_API_KEY, skipping image generation")
            return None

        client = OpenAI(api_key=api_key)

        response = client.images.generate(
            model="dall-e-3",
            prompt=full_prompt,
            n=1,
            size="1792x1024",
            quality="standard",
        )

        image_url = response.data[0].url

        # Download image
        img_response = requests.get(image_url)
        img_response.raise_for_status()

        # Create safe filename
        safe_title = "".join(c if c.isalnum() or c in (' ', '-') else '_' for c in title)
        safe_title = safe_title.replace(' ', '-')[:50]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_title}_{timestamp}.png"

        filepath = os.path.join(IMAGES_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(img_response.content)

        print(f"✅ Image saved: {filename}")
        return f"/images/blog/{filename}"

    except Exception as e:
        print(f"⚠️  Could not generate image: {e}")
        return None

############################################################
# Save post
############################################################
def create_slug(title):
    """Create URL-friendly slug from title"""
    slug = title.lower()
    # Swedish character replacements
    replacements = {'å': 'a', 'ä': 'a', 'ö': 'o', 'é': 'e'}
    for old, new in replacements.items():
        slug = slug.replace(old, new)

    # Keep only alphanumeric and spaces
    slug = "".join(c if c.isalnum() or c == ' ' else '' for c in slug)
    # Replace spaces with hyphens
    slug = '-'.join(slug.split())

    return slug

def extract_keywords(title, content):
    """Extract relevant keywords for SEO"""
    # Common keywords for kontorshotell content
    base_keywords = ["kontorshotell", "stockholm", "dg97", "vasastan"]

    # Extract from title
    title_words = [w.lower() for w in title.split() if len(w) > 3]

    # Combine and deduplicate
    all_keywords = base_keywords + title_words[:5]
    keywords = ", ".join(dict.fromkeys(all_keywords))

    return keywords[:200]  # Limit length

def save_blog_post(title, content, excerpt, image_path):
    """Save blog post as markdown file"""
    slug = create_slug(title)
    date = datetime.now().strftime("%Y-%m-%d")

    # Extract keywords from title for SEO
    keywords = extract_keywords(title, content)

    # Create frontmatter with enhanced SEO
    frontmatter = f"""---
title: "{title}"
date: "{date}"
author: "AIda"
authorRole: "Kontorsassistent på DG97"
excerpt: "{excerpt}"
featuredImage: "{image_path if image_path else '/images/office_room.jpg'}"
featuredImageAlt: "{title} - DG97 Kontorshotell Stockholm"
keywords: "{keywords}"
canonical: "https://dg97.se/blogg/{slug}"
---

"""

    # Combine frontmatter and content
    full_content = frontmatter + content

    # Save to file
    filename = f"{slug}.md"
    filepath = os.path.join(POSTS_DIR, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)

    print(f"✅ Blog post saved: {filename}")
    return filepath

############################################################
# Publish to site
############################################################
def publish_to_site(title, content, excerpt, category, image_path):
    """Publish blog post directly to site via API"""
    api_url = os.getenv("DG97_API_URL", "http://localhost:3000") + "/api/posts/create"

    print(f"\n📤 Publishing to: {api_url}")

    payload = {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "category": category,
        "image": image_path or "/images/office_room.jpg"
    }

    try:
        response = requests.post(api_url, json=payload, timeout=30)

        if response.status_code == 201:
            data = response.json()
            print(f"✅ Published successfully!")
            print(f"🌐 URL: {data.get('url', 'N/A')}")
            if data.get('github_url'):
                print(f"📦 GitHub: {data['github_url']}")
            print(f"⏳ {data.get('info', 'Site will update shortly')}")
            return True
        else:
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else {}
            print(f"❌ Publishing failed: {error_data.get('error', response.text)}")
            return False

    except requests.exceptions.Timeout:
        print("❌ Request timed out. Site might be down or URL incorrect.")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Check if site is running and URL is correct.")
        return False
    except Exception as e:
        print(f"❌ Error publishing: {str(e)}")
        return False

############################################################
# Utility functions
############################################################
def count_posts():
    """Count existing blog posts"""
    if not os.path.exists(POSTS_DIR):
        return 0
    return len([f for f in os.listdir(POSTS_DIR) if f.endswith('.md')])

############################################################
# Main workflow
############################################################
def generate_post(title, category, auto_publish=False):
    """Complete workflow to generate a blog post"""
    print("\n" + "="*60)
    print("🚀 Starting blog post generation")
    print(f"📝 Title: {title}")
    print(f"🏷️  Category: {category}")
    print("="*60 + "\n")

    # Generate content
    content = generate_blog_post(title, category)
    if not content:
        print("❌ Failed to generate content")
        return None

    # Generate meta description
    excerpt = generate_meta_description(title)

    # Generate image
    image_path = generate_image(title, category)

    # Save post locally
    filepath = save_blog_post(title, content, excerpt, image_path)

    print("\n" + "="*60)
    print("✅ BLOG POST GENERATION COMPLETE!")
    print(f"📄 Local file: {filepath}")
    print(f"🌐 Will be available at: /blogg/{create_slug(title)}")
    print("="*60 + "\n")

    # Ask about publishing
    if auto_publish:
        publish_success = publish_to_site(title, content, excerpt, category, image_path)
        if not publish_success:
            print("⚠️  Post saved locally but not published. You can publish it later.")

    return filepath

############################################################
# CLI Interface
############################################################
def show_menu():
    """Display interactive menu"""
    print("\n" + "="*60)
    print("🏢 DG97 BLOG GENERATOR")
    print("="*60)

    print("\nSelect category:")
    categories = list(KONTORSHOTELL_TOPICS.keys())
    for i, cat in enumerate(categories, 1):
        print(f"{i}. {cat.capitalize()}")
    print("0. Exit")

    choice = input("\nYour choice (0-6): ").strip()

    if choice == "0":
        return None, None

    try:
        cat_index = int(choice) - 1
        if 0 <= cat_index < len(categories):
            category = categories[cat_index]
            topics = KONTORSHOTELL_TOPICS[category]

            print(f"\n{category.upper()} TOPICS:")
            for i, topic in enumerate(topics, 1):
                print(f"{i}. {topic}")
            print("0. Custom topic")

            topic_choice = input("\nYour choice: ").strip()

            if topic_choice == "0":
                custom_topic = input("\nEnter your custom topic: ").strip()
                return custom_topic, category if custom_topic else (None, None)
            else:
                topic_index = int(topic_choice) - 1
                if 0 <= topic_index < len(topics):
                    return topics[topic_index], category

        print("Invalid choice!")
        return None, None

    except ValueError:
        print("Invalid input!")
        return None, None

def main():
    """Main entry point"""
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY environment variable not set!")
        print("Set it with: export OPENAI_API_KEY='your-key-here'")
        return

    while True:
        title, category = show_menu()

        if title is None:
            print("\n👋 Goodbye!")
            break

        generate_post(title, category)

        another = input("\nGenerate another post? (y/n): ").strip().lower()
        if another != 'y':
            print("\n👋 Goodbye!")
            break

if __name__ == "__main__":
    main()

