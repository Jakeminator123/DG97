"""
DG97 Blog Control Panel
Advanced control panel for blog management
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from dg97_blog_gen import generate_post, KONTORSHOTELL_TOPICS, POSTS_DIR, analyze_existing_posts
except ImportError:
    print("❌ Could not import dg97_blog_gen module")
    sys.exit(1)

############################################################
# Statistics and Management
############################################################

def count_posts():
    """Count existing blog posts"""
    if not os.path.exists(POSTS_DIR):
        return 0
    return len([f for f in os.listdir(POSTS_DIR) if f.endswith('.md')])

def list_posts():
    """List all existing posts"""
    if not os.path.exists(POSTS_DIR):
        print("No posts directory found")
        return
    
    posts = [f for f in os.listdir(POSTS_DIR) if f.endswith('.md')]
    
    if not posts:
        print("📭 No blog posts found")
        return
    
    print(f"\n📚 Found {len(posts)} blog posts:")
    print("-" * 60)
    
    for post in sorted(posts):
        filepath = os.path.join(POSTS_DIR, post)
        mod_time = datetime.fromtimestamp(os.path.getmtime(filepath))
        
        # Read title from file
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'title:' in content:
                    title_line = [line for line in content.split('\n') if 'title:' in line][0]
                    title = title_line.split('title:', 1)[1].strip().strip('"')
                else:
                    title = post.replace('.md', '')
        except:
            title = post.replace('.md', '')
        
        print(f"📄 {post}")
        print(f"   Title: {title}")
        print(f"   Modified: {mod_time.strftime('%Y-%m-%d %H:%M')}")
        print()

def batch_generate():
    """Generate multiple posts at once"""
    print("\n" + "="*60)
    print("🚀 BATCH GENERATION")
    print("="*60)
    
    posts_to_generate = []
    
    print("\nSelect posts to generate (enter numbers separated by commas)")
    print("Example: 1,3,5 or 'all' for all categories")
    print()
    
    # Show all topics
    for category, topics in KONTORSHOTELL_TOPICS.items():
        print(f"\n{category.upper()}:")
        for i, topic in enumerate(topics, 1):
            idx = len(posts_to_generate) + 1
            posts_to_generate.append((topic, category))
            print(f"{idx}. {topic}")
    
    choice = input("\nYour selection: ").strip().lower()
    
    if choice == 'all':
        selected = posts_to_generate
    else:
        try:
            indices = [int(x.strip()) for x in choice.split(',')]
            selected = [posts_to_generate[i-1] for i in indices if 0 < i <= len(posts_to_generate)]
        except (ValueError, IndexError):
            print("❌ Invalid selection")
            return
    
    if not selected:
        print("No posts selected")
        return
    
    print(f"\n📝 Will generate {len(selected)} posts:")
    for topic, cat in selected:
        print(f"  - [{cat}] {topic}")
    
    confirm = input("\nProceed? (y/n): ").strip().lower()
    if confirm != 'y':
        print("Cancelled")
        return
    
    # Generate posts
    success_count = 0
    for i, (topic, category) in enumerate(selected, 1):
        print(f"\n[{i}/{len(selected)}] Generating...")
        try:
            result = generate_post(topic, category)
            if result:
                success_count += 1
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "="*60)
    print(f"✅ Batch generation complete: {success_count}/{len(selected)} successful")
    print("="*60)

def content_calendar():
    """Show content calendar with suggestions"""
    print("\n" + "="*60)
    print("📅 CONTENT CALENDAR SUGGESTIONS")
    print("="*60)
    
    # Analyze existing posts
    existing_count = count_posts()
    print(f"\nCurrent posts: {existing_count}")
    
    # Suggest balanced content
    suggestions = {
        "Week 1": [
            ("startup", "Varför startups väljer kontorshotell framför hemmakontor"),
            ("produktivitet", "5 produktivitets-hacks för småföretagare")
        ],
        "Week 2": [
            ("arbetsliv", "Work-life balance som egenföretagare"),
            ("ekonomi", "ROI av kontorshotell för småföretag")
        ],
        "Week 3": [
            ("stockholm", "Vasastans charm för företagare"),
            ("nätverk", "Hur man nätverkar naturligt på kontorshotell")
        ],
        "Week 4": [
            ("startup", "Budget-tips för startups som söker kontor i Stockholm"),
            ("produktivitet", "Telefonbås och fokuszoner - varför de är viktiga")
        ]
    }
    
    print("\n📋 Suggested posting schedule (4 weeks):\n")
    for week, posts in suggestions.items():
        print(f"{week}:")
        for cat, title in posts:
            print(f"  📝 [{cat}] {title}")
        print()
    
    print("💡 Tip: Maintain 2 posts per week for consistent engagement")

def preview_topic():
    """Preview what a topic will generate (without actual generation)"""
    print("\n" + "="*60)
    print("👁️  TOPIC PREVIEW")
    print("="*60)
    
    print("\nThis will show you what content will be generated")
    print("without actually creating the post.\n")
    
    # Show categories
    categories = list(KONTORSHOTELL_TOPICS.keys())
    for i, cat in enumerate(categories, 1):
        print(f"{i}. {cat.capitalize()}")
    
    choice = input("\nSelect category: ").strip()
    
    try:
        cat_index = int(choice) - 1
        if 0 <= cat_index < len(categories):
            category = categories[cat_index]
            topics = KONTORSHOTELL_TOPICS[category]
            
            print(f"\n{category.upper()} TOPICS:")
            for i, topic in enumerate(topics, 1):
                print(f"{i}. {topic}")
            
            topic_choice = input("\nSelect topic: ").strip()
            topic_index = int(topic_choice) - 1
            
            if 0 <= topic_index < len(topics):
                title = topics[topic_index]
                
                print("\n" + "="*60)
                print("PREVIEW")
                print("="*60)
                print(f"\nTitle: {title}")
                print(f"Category: {category}")
                print(f"Slug: {title.lower().replace(' ', '-')[:50]}")
                print(f"Date: {datetime.now().strftime('%Y-%m-%d')}")
                print(f"\nEstimated word count: 800-1200")
                print(f"Will include: AI-generated image")
                print(f"SEO: Meta description will be auto-generated")
                print("\n" + "="*60)
    
    except (ValueError, IndexError):
        print("Invalid selection")

############################################################
# Main Menu
############################################################

def show_main_menu():
    """Show main control panel menu"""
    print("\n" + "="*60)
    print("🏢 DG97 BLOG CONTROL PANEL")
    print("="*60)
    
    print(f"\n📊 Statistics: {count_posts()} blog posts")
    
    print("\n📋 MENU:")
    print("1. Generate single post")
    print("2. Batch generate posts")
    print("3. List all posts")
    print("4. Content calendar")
    print("5. Preview topic")
    print("6. Analyze existing tone")
    print("0. Exit")
    
    return input("\nYour choice: ").strip()

def main():
    """Main control panel loop"""
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("\n" + "="*60)
        print("❌ OPENAI_API_KEY NOT SET")
        print("="*60)
        print("\nTo use this tool, you need to set your OpenAI API key:")
        print("  export OPENAI_API_KEY='your-key-here'")
        print("\nOr on Windows:")
        print("  set OPENAI_API_KEY=your-key-here")
        print()
        return
    
    print("\n🎉 Welcome to DG97 Blog Control Panel!")
    print("Your smart assistant for blog content generation")
    
    while True:
        choice = show_main_menu()
        
        if choice == "0":
            print("\n👋 Goodbye!")
            break
        
        elif choice == "1":
            # Import the original menu function
            from dg97_blog_gen import show_menu
            title, category = show_menu()
            if title:
                generate_post(title, category)
        
        elif choice == "2":
            batch_generate()
        
        elif choice == "3":
            list_posts()
        
        elif choice == "4":
            content_calendar()
        
        elif choice == "5":
            preview_topic()
        
        elif choice == "6":
            print("\n🔍 Analyzing existing posts...")
            tone = analyze_existing_posts()
            if tone:
                print(f"\n✅ Found {len(tone)} characters of content to analyze")
                print("This will be used to match your writing style.")
            else:
                print("\n⚠️  No existing posts found to analyze")
        
        else:
            print("❌ Invalid choice")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()

