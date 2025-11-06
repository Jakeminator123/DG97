"""
DG97 Blog Scheduler
Automatic blog post generation based on schedule
"""

import os
import sys
import json
import time
import schedule
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Load environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
dotenv_path = os.path.join(PROJECT_ROOT, ".env")

if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# Import generator
try:
    from dg97_blog_gen import generate_post, KONTORSHOTELL_TOPICS
except ImportError as e:
    print(f"Error importing generator: {e}")
    sys.exit(1)

############################################################
# Configuration
############################################################
SCHEDULE_FILE = os.path.join(BASE_DIR, "schedule.json")

############################################################
# Schedule Management
############################################################

def load_schedule():
    """Load scheduled posts from file"""
    if os.path.exists(SCHEDULE_FILE):
        try:
            with open(SCHEDULE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  Could not load schedule: {e}")
            return []
    return []

def save_schedule(schedule_data):
    """Save updated schedule to file"""
    with open(SCHEDULE_FILE, 'w', encoding='utf-8') as f:
        json.dump(schedule_data, f, indent=2, ensure_ascii=False)

def should_post_today(sched_entry):
    """Determine if a post should be created today"""
    frequency = sched_entry.get('frequency', 'once')
    last_post = sched_entry.get('last_post')
    
    if frequency == 'once':
        # One-time post - only if never posted
        return last_post is None
    
    if last_post:
        last_post_date = datetime.fromisoformat(last_post).date()
        today = datetime.now().date()
        days_since = (today - last_post_date).days
    else:
        days_since = 999  # No previous post
    
    if frequency == 'daily':
        return days_since >= 1
    
    elif frequency == 'weekly':
        # Monday posts
        return datetime.now().weekday() == 0 and days_since >= 7
    
    elif frequency == 'weekly_wed':
        # Wednesday posts
        return datetime.now().weekday() == 2 and days_since >= 7
    
    elif frequency == 'biweekly':
        # Monday and Wednesday
        return datetime.now().weekday() in [0, 2] and days_since >= 2
    
    return False

def get_next_topic(category, used_topics):
    """Get next topic from category, cycling through available topics"""
    if category not in KONTORSHOTELL_TOPICS:
        return None
    
    available_topics = KONTORSHOTELL_TOPICS[category]
    
    # Filter out recently used topics
    unused_topics = [t for t in available_topics if t not in used_topics]
    
    if unused_topics:
        return unused_topics[0]
    else:
        # All topics used, start over
        return available_topics[0] if available_topics else None

############################################################
# Scheduled Job
############################################################

def check_and_generate():
    """Check schedule and generate posts as needed"""
    print(f"\n{'='*60}")
    print(f"🕐 Scheduler Check: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")
    
    schedule_data = load_schedule()
    
    if not schedule_data:
        print("📭 No schedules configured")
        return
    
    active_schedules = [s for s in schedule_data if s.get('active', True)]
    
    if not active_schedules:
        print("📭 No active schedules")
        return
    
    print(f"📋 Found {len(active_schedules)} active schedule(s)")
    
    posts_generated = 0
    
    for i, sched in enumerate(active_schedules):
        category = sched.get('category', 'startup')
        topic = sched.get('topic')
        frequency = sched.get('frequency', 'once')
        
        print(f"\n[{i+1}/{len(active_schedules)}] Checking schedule...")
        print(f"   Category: {category}")
        print(f"   Topic: {topic}")
        print(f"   Frequency: {frequency}")
        print(f"   Last post: {sched.get('last_post', 'Never')}")
        
        if should_post_today(sched):
            print(f"   ✓ Generating post now...")
            
            try:
                # Get topic if using rotation
                if topic == "AUTO_ROTATE":
                    used_topics = sched.get('used_topics', [])
                    topic = get_next_topic(category, used_topics)
                    
                    if not topic:
                        print("   ❌ No topics available")
                        continue
                    
                    # Update used topics
                    if 'used_topics' not in sched:
                        sched['used_topics'] = []
                    sched['used_topics'].append(topic)
                
                # Generate post
                result = generate_post(topic, category)
                
                if result:
                    # Update last post time
                    sched['last_post'] = datetime.now().isoformat()
                    
                    # Deactivate if once
                    if frequency == 'once':
                        sched['active'] = False
                    
                    posts_generated += 1
                    print(f"   ✅ Post generated successfully!")
                else:
                    print(f"   ❌ Failed to generate post")
            
            except Exception as e:
                print(f"   ❌ Error: {e}")
        else:
            print(f"   ⏭️  Skipping (not scheduled for today)")
    
    # Save updated schedule
    if posts_generated > 0:
        save_schedule(schedule_data)
        print(f"\n{'='*60}")
        print(f"✅ Generated {posts_generated} post(s)")
        print(f"{'='*60}\n")

############################################################
# Scheduler Setup
############################################################

def setup_scheduler():
    """Setup scheduled jobs"""
    # Run check every day at 09:00
    schedule.every().day.at("09:00").do(check_and_generate)
    
    print("="*60)
    print("⏰ DG97 Blog Scheduler Started")
    print("="*60)
    print(f"\nScheduled check time: Daily at 09:00")
    print(f"Next check: {schedule.next_run()}")
    print("\nPress Ctrl+C to stop\n")
    print("="*60)

def run_scheduler():
    """Run the scheduler loop"""
    setup_scheduler()
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        print("\n\n⏹️  Scheduler stopped by user")
        print("="*60)

############################################################
# CLI Interface
############################################################

def show_menu():
    """Show scheduler menu"""
    print("\n" + "="*60)
    print("⏰ DG97 BLOG SCHEDULER")
    print("="*60)
    
    print("\n1. Run scheduler (continuous)")
    print("2. Check and generate now (one-time)")
    print("3. View schedule")
    print("4. Test schedule (no generation)")
    print("0. Exit")
    
    return input("\nYour choice: ").strip()

def view_schedule():
    """View current schedule"""
    schedule_data = load_schedule()
    
    if not schedule_data:
        print("\n📭 No schedules configured")
        return
    
    active = [s for s in schedule_data if s.get('active', True)]
    
    print(f"\n📋 Found {len(schedule_data)} schedule(s) ({len(active)} active)")
    print("="*60)
    
    for i, sched in enumerate(schedule_data, 1):
        status = "✓ Active" if sched.get('active', True) else "✗ Inactive"
        print(f"\n{i}. [{status}]")
        print(f"   Category: {sched.get('category')}")
        print(f"   Topic: {sched.get('topic')}")
        print(f"   Frequency: {sched.get('frequency')}")
        print(f"   Created: {sched.get('created', 'Unknown')}")
        print(f"   Last post: {sched.get('last_post', 'Never')}")

def test_schedule():
    """Test schedule without generating"""
    print("\n🧪 Testing schedule (no generation)...\n")
    
    schedule_data = load_schedule()
    
    if not schedule_data:
        print("📭 No schedules configured")
        return
    
    active = [s for s in schedule_data if s.get('active', True)]
    
    print(f"Found {len(active)} active schedule(s)\n")
    
    would_post_count = 0
    
    for i, sched in enumerate(active, 1):
        print(f"{i}. {sched.get('topic')}")
        print(f"   Frequency: {sched.get('frequency')}")
        
        if should_post_today(sched):
            print(f"   ✓ WOULD POST TODAY")
            would_post_count += 1
        else:
            print(f"   ⏭️  Would skip")
        print()
    
    print(f"Result: Would generate {would_post_count} post(s) today")

############################################################
# Main
############################################################

def main():
    """Main entry point"""
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("\n" + "="*60)
        print("❌ OPENAI_API_KEY NOT SET")
        print("="*60)
        print("\nPlease configure OPENAI_API_KEY in .env file")
        return
    
    while True:
        choice = show_menu()
        
        if choice == "0":
            print("\n👋 Goodbye!")
            break
        
        elif choice == "1":
            run_scheduler()
        
        elif choice == "2":
            check_and_generate()
            input("\nPress Enter to continue...")
        
        elif choice == "3":
            view_schedule()
            input("\nPress Enter to continue...")
        
        elif choice == "4":
            test_schedule()
            input("\nPress Enter to continue...")
        
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()

