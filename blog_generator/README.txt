================================================================================
DG97 BLOG GENERATOR - QUICK START GUIDE
================================================================================

🎯 WHAT IS THIS?
A smart AI-powered blog generator that creates SEO-optimized blog posts for 
DG97 kontorshotell website, complete with AI-generated images.

📋 FEATURES:
✓ AI-generated blog content (GPT-4)
✓ AI-generated images (DALL-E 3)
✓ SEO-optimized meta descriptions
✓ Automatic markdown formatting
✓ Hot-reloading in dev mode (posts appear immediately)
✓ Smart content calendar
✓ Batch generation
✓ Tone analysis from existing posts

================================================================================
🚀 QUICK START
================================================================================

1. SET UP OPENAI API KEY:
   
   Windows (PowerShell):
   $env:OPENAI_API_KEY="your-key-here"
   
   Windows (CMD):
   set OPENAI_API_KEY=your-key-here
   
   Mac/Linux:
   export OPENAI_API_KEY="your-key-here"

2. INSTALL DEPENDENCIES:
   pip install openai requests

3. RUN THE CONTROL PANEL:
   python control_panel.py

4. START DEV SERVER (in another terminal):
   cd dg97-site
   npm run dev

5. GENERATE A POST:
   - Select category and topic from menu
   - Wait for generation (30-60 seconds)
   - Refresh browser at http://localhost:3000/blogg
   - Post appears automatically! (auto-refresh every 3 seconds)

================================================================================
📖 USAGE EXAMPLES
================================================================================

SINGLE POST:
> python control_panel.py
> Choose option 1
> Select category and topic
> Post is generated and saved automatically

BATCH GENERATION:
> python control_panel.py
> Choose option 2
> Select multiple posts (e.g., "1,3,5")
> All posts are generated

CONTENT CALENDAR:
> python control_panel.py
> Choose option 4
> See suggested posting schedule

================================================================================
📂 FILE STRUCTURE
================================================================================

blog_generator/
├── dg97_blog_gen.py      # Core generator
├── control_panel.py       # Control panel CLI
└── README.txt             # This file

dg97-site/
├── content/posts/         # Generated .md files go here
└── public/images/blog/    # Generated images go here

================================================================================
🎨 TOPICS AVAILABLE
================================================================================

STARTUP:
- Varför startups väljer kontorshotell framför hemmakontor
- 5 saker varje startup behöver från sitt kontor
- Hur kontorshotell hjälper startups att växa snabbare
- Budget-tips för startups som söker kontor i Stockholm
- Nätverkande för startups på kontorshotell

PRODUKTIVITET:
- Vetenskapen bakom produktivitet på kontorshotell
- Hur du skapar den perfekta arbetsrutinen på kontoret
- 5 produktivitets-hacks för småföretagare
- Fokuserat arbete vs öppna kontorslandskap
- Telefonbås och fokuszoner - varför de är viktiga

ARBETSLIV:
- Work-life balance som egenföretagare
- Varför hemarbete inte passar alla
- Mentala hälsofördelar med ett dedikerat kontor
- Att separera jobb och hem - en guide
- Sociala aspekter av kontorshotell

EKONOMI:
- Den dolda kostnaden av hemmakontor
- ROI av kontorshotell för småföretag
- Skattemässiga fördelar med kontorshotell
- Att budgetera för kontor som nystartat företag
- Jämförelse: coworking vs kontorshotell vs eget kontor

STOCKHOLM:
- Bästa områdena för kontor i Stockholm 2024
- Vasastans charm för företagare
- Stockholm kontorshotell guide
- Pendling vs centralt läge - vad är värt priset?
- Drottninggatan som företagsadress

NÄTVERK:
- Hur man nätverkar naturligt på kontorshotell
- Skapa meningsfulla affärskontakter
- Introvert? Så här nätverkar du ändå
- Community-driven tillväxt
- 5 nätverksevent att arrangera på ditt kontorshotell

================================================================================
🔧 HOW IT WORKS
================================================================================

1. CONTENT GENERATION:
   - Analyzes your existing blog posts to match tone
   - Uses GPT-4 to generate ~1000 word article
   - Structures content with proper markdown

2. IMAGE GENERATION:
   - Creates contextually relevant image with DALL-E 3
   - Saves to public/images/blog/
   - Links automatically in frontmatter

3. SEO OPTIMIZATION:
   - Generates meta description
   - Creates URL-friendly slug
   - Adds proper frontmatter

4. SAVING:
   - Saves as .md file in content/posts/
   - Next.js API route picks it up immediately
   - Appears on website within 3 seconds (dev mode)

================================================================================
💡 TIPS
================================================================================

✓ Generate 2 posts per week for consistent engagement
✓ Mix categories for diverse content
✓ Review and edit generated posts before publishing
✓ Use custom topics (option 0) for specific needs
✓ Check content calendar for balanced scheduling

================================================================================
🐛 TROUBLESHOOTING
================================================================================

Posts don't appear?
→ Check that dev server is running (npm run dev)
→ Wait 3 seconds for auto-refresh
→ Check browser console for errors

Image generation fails?
→ DALL-E can be slow, posts will use fallback image
→ Check your OpenAI API credits

API errors?
→ Verify OPENAI_API_KEY is set correctly
→ Check your OpenAI account has credits

================================================================================
📞 SUPPORT
================================================================================

For issues or questions, check:
- OpenAI API status: https://status.openai.com
- Next.js docs: https://nextjs.org/docs

================================================================================

