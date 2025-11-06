"""
DG97 Blog Generator - GUI Version
Beautiful Tkinter interface for blog generation
"""

import os
import sys
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import threading
from datetime import datetime, timedelta
import json

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Import generator functions
try:
    from dg97_blog_gen import (
        generate_post, KONTORSHOTELL_TOPICS, 
        count_posts, POSTS_DIR, PROJECT_ROOT
    )
except ImportError as e:
    print(f"Error importing generator: {e}")
    sys.exit(1)

############################################################
# Scheduler Storage
############################################################
SCHEDULE_FILE = os.path.join(PROJECT_ROOT, "blog_generator", "schedule.json")

def load_schedule():
    """Load scheduled posts from file"""
    if os.path.exists(SCHEDULE_FILE):
        try:
            with open(SCHEDULE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_schedule(schedule):
    """Save scheduled posts to file"""
    with open(SCHEDULE_FILE, 'w', encoding='utf-8') as f:
        json.dump(schedule, f, indent=2, ensure_ascii=False)

############################################################
# Main GUI Application
############################################################
class BlogGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("DG97 Blog Generator")
        self.root.geometry("800x700")
        self.root.resizable(False, False)
        
        # Set icon (if available)
        try:
            self.root.iconbitmap(os.path.join(PROJECT_ROOT, "dg97-site", "public", "favicon.ico"))
        except:
            pass
        
        # Variables
        self.category_var = tk.StringVar()
        self.topic_var = tk.StringVar()
        self.frequency_var = tk.StringVar(value="once")
        self.custom_topic_var = tk.StringVar()
        
        # Schedule
        self.schedule = load_schedule()
        
        # Create UI
        self.create_header()
        self.create_category_section()
        self.create_topic_section()
        self.create_frequency_section()
        self.create_buttons()
        self.create_status_section()
        self.create_schedule_section()
        
        # Update topics on category change
        self.category_var.trace('w', self.update_topics)
        
        # Initialize
        self.update_stats()
    
    def create_header(self):
        """Create header section"""
        header_frame = tk.Frame(self.root, bg="#2c3e50", height=80)
        header_frame.pack(fill=tk.X)
        header_frame.pack_propagate(False)
        
        title = tk.Label(
            header_frame, 
            text="🏢 DG97 Blog Generator",
            font=("Arial", 24, "bold"),
            bg="#2c3e50",
            fg="white"
        )
        title.pack(pady=20)
    
    def create_category_section(self):
        """Create category selection"""
        frame = tk.LabelFrame(self.root, text="1. Välj Kategori", font=("Arial", 12, "bold"), padx=20, pady=10)
        frame.pack(fill=tk.X, padx=20, pady=(20, 5))
        
        categories = list(KONTORSHOTELL_TOPICS.keys())
        category_display = [cat.capitalize() for cat in categories]
        
        self.category_combo = ttk.Combobox(
            frame, 
            textvariable=self.category_var,
            values=category_display,
            state="readonly",
            font=("Arial", 11),
            width=50
        )
        self.category_combo.pack(pady=5)
        
        if categories:
            self.category_combo.current(0)
    
    def create_topic_section(self):
        """Create topic selection"""
        frame = tk.LabelFrame(self.root, text="2. Välj Ämne", font=("Arial", 12, "bold"), padx=20, pady=10)
        frame.pack(fill=tk.X, padx=20, pady=5)
        
        self.topic_combo = ttk.Combobox(
            frame,
            textvariable=self.topic_var,
            state="readonly",
            font=("Arial", 11),
            width=70
        )
        self.topic_combo.pack(pady=5)
        
        # Custom topic option
        custom_frame = tk.Frame(frame)
        custom_frame.pack(pady=5)
        
        tk.Label(custom_frame, text="Eller eget ämne:", font=("Arial", 10)).pack(side=tk.LEFT, padx=5)
        
        self.custom_entry = tk.Entry(
            custom_frame,
            textvariable=self.custom_topic_var,
            font=("Arial", 10),
            width=60
        )
        self.custom_entry.pack(side=tk.LEFT, padx=5)
    
    def create_frequency_section(self):
        """Create frequency/schedule section"""
        frame = tk.LabelFrame(self.root, text="3. Publiceringsfrekvens", font=("Arial", 12, "bold"), padx=20, pady=10)
        frame.pack(fill=tk.X, padx=20, pady=5)
        
        frequencies = [
            ("Publicera nu (en gång)", "once"),
            ("Daglig publicering", "daily"),
            ("Varje vecka (måndag)", "weekly"),
            ("Varje vecka (onsdag)", "weekly_wed"),
            ("Två gånger i veckan (mån + ons)", "biweekly"),
        ]
        
        for text, value in frequencies:
            rb = tk.Radiobutton(
                frame,
                text=text,
                variable=self.frequency_var,
                value=value,
                font=("Arial", 10)
            )
            rb.pack(anchor=tk.W, pady=2)
    
    def create_buttons(self):
        """Create action buttons"""
        frame = tk.Frame(self.root)
        frame.pack(pady=15)
        
        # Generate button
        self.generate_btn = tk.Button(
            frame,
            text="🚀 Generera & Publicera",
            command=self.generate_post,
            font=("Arial", 12, "bold"),
            bg="#3498db",
            fg="white",
            padx=20,
            pady=10,
            cursor="hand2"
        )
        self.generate_btn.pack(side=tk.LEFT, padx=10)
        
        # View schedule button
        view_schedule_btn = tk.Button(
            frame,
            text="📅 Visa Schema",
            command=self.show_schedule,
            font=("Arial", 10),
            bg="#95a5a6",
            fg="white",
            padx=15,
            pady=10,
            cursor="hand2"
        )
        view_schedule_btn.pack(side=tk.LEFT, padx=10)
    
    def create_status_section(self):
        """Create status display"""
        frame = tk.LabelFrame(self.root, text="Status", font=("Arial", 11, "bold"), padx=10, pady=5)
        frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=5)
        
        self.status_text = scrolledtext.ScrolledText(
            frame,
            height=10,
            font=("Consolas", 9),
            bg="#f8f9fa",
            fg="#2c3e50"
        )
        self.status_text.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Stats label
        self.stats_label = tk.Label(
            frame,
            text="Totalt antal inlägg: 0",
            font=("Arial", 10),
            fg="#7f8c8d"
        )
        self.stats_label.pack(pady=5)
    
    def create_schedule_section(self):
        """Create schedule display"""
        frame = tk.LabelFrame(self.root, text="⏰ Schemalagda Inlägg", font=("Arial", 10, "bold"), padx=10, pady=5)
        frame.pack(fill=tk.X, padx=20, pady=(5, 20))
        
        self.schedule_label = tk.Label(
            frame,
            text="Inga schemalagda inlägg",
            font=("Arial", 9),
            fg="#7f8c8d"
        )
        self.schedule_label.pack(pady=5)
        
        self.update_schedule_display()
    
    def update_topics(self, *args):
        """Update topic list based on selected category"""
        category = self.category_var.get().lower()
        
        if category in KONTORSHOTELL_TOPICS:
            topics = KONTORSHOTELL_TOPICS[category]
            self.topic_combo['values'] = topics
            if topics:
                self.topic_combo.current(0)
    
    def update_stats(self):
        """Update statistics display"""
        try:
            post_count = len([f for f in os.listdir(POSTS_DIR) if f.endswith('.md')])
            self.stats_label.config(text=f"Totalt antal inlägg: {post_count}")
        except:
            self.stats_label.config(text="Totalt antal inlägg: 0")
    
    def update_schedule_display(self):
        """Update schedule display"""
        active_schedules = [s for s in self.schedule if s.get('active', True)]
        
        if not active_schedules:
            self.schedule_label.config(text="Inga schemalagda inlägg")
        else:
            schedule_text = f"{len(active_schedules)} aktiva scheman: "
            freq_counts = {}
            for s in active_schedules:
                freq = s.get('frequency', 'unknown')
                freq_counts[freq] = freq_counts.get(freq, 0) + 1
            
            schedule_text += ", ".join([f"{v} {k}" for k, v in freq_counts.items()])
            self.schedule_label.config(text=schedule_text)
    
    def log(self, message):
        """Add message to status log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.status_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.status_text.see(tk.END)
        self.root.update()
    
    def generate_post(self):
        """Generate and publish blog post"""
        # Get selected values
        category = self.category_var.get().lower()
        
        # Check for custom topic
        custom_topic = self.custom_topic_var.get().strip()
        if custom_topic:
            topic = custom_topic
        else:
            topic = self.topic_var.get()
        
        frequency = self.frequency_var.get()
        
        # Validate
        if not topic:
            messagebox.showwarning("Varning", "Vänligen välj ett ämne eller skriv ett eget!")
            return
        
        # Disable button during generation
        self.generate_btn.config(state=tk.DISABLED, text="Genererar...")
        
        # Create schedule if needed
        if frequency != "once":
            self.create_schedule(category, topic, frequency)
            self.log(f"✓ Schema skapat för '{topic}' ({frequency})")
            self.update_schedule_display()
        
        # Generate post in thread
        thread = threading.Thread(
            target=self._generate_post_thread,
            args=(topic, category)
        )
        thread.daemon = True
        thread.start()
    
    def _generate_post_thread(self, topic, category):
        """Generate post in background thread"""
        try:
            self.log(f"🚀 Startar generering...")
            self.log(f"📝 Ämne: {topic}")
            self.log(f"🏷️  Kategori: {category}")
            self.log("")
            
            self.log("🤖 Genererar innehåll med GPT-4...")
            
            # Generate post
            result = generate_post(topic, category)
            
            if result:
                self.log("✅ Innehåll genererat!")
                self.log(f"📄 Sparad: {os.path.basename(result)}")
                self.log("")
                self.log("🌐 Inlägget kommer dyka upp på sajten inom 3 sekunder!")
                self.log("💡 Öppna: http://localhost:3000/blogg")
                
                # Update stats
                self.root.after(0, self.update_stats)
                
                messagebox.showinfo(
                    "Klart!", 
                    f"Blogginlägget '{topic}' har genererats och publicerats!\n\n"
                    f"Öppna: http://localhost:3000/blogg"
                )
            else:
                self.log("❌ Fel vid generering")
                messagebox.showerror("Fel", "Kunde inte generera inlägg. Kolla API-nyckel och status.")
        
        except Exception as e:
            self.log(f"❌ Error: {str(e)}")
            messagebox.showerror("Fel", f"Ett fel uppstod:\n{str(e)}")
        
        finally:
            # Re-enable button
            self.root.after(0, lambda: self.generate_btn.config(
                state=tk.NORMAL, 
                text="🚀 Generera & Publicera"
            ))
    
    def create_schedule(self, category, topic, frequency):
        """Create a schedule for automatic posting"""
        schedule_entry = {
            "category": category,
            "topic": topic,
            "frequency": frequency,
            "created": datetime.now().isoformat(),
            "active": True,
            "last_post": None
        }
        
        self.schedule.append(schedule_entry)
        save_schedule(self.schedule)
    
    def show_schedule(self):
        """Show schedule management window"""
        schedule_window = tk.Toplevel(self.root)
        schedule_window.title("Schemalägga Inlägg")
        schedule_window.geometry("600x400")
        
        tk.Label(
            schedule_window,
            text="📅 Schemalagda Inlägg",
            font=("Arial", 16, "bold")
        ).pack(pady=20)
        
        if not self.schedule:
            tk.Label(
                schedule_window,
                text="Inga schemalagda inlägg än.\n\nVälj en frekvens och generera ett inlägg för att skapa ett schema.",
                font=("Arial", 11),
                fg="#7f8c8d"
            ).pack(pady=30)
        else:
            # List schedules
            list_frame = tk.Frame(schedule_window)
            list_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
            
            for i, sched in enumerate(self.schedule):
                if not sched.get('active', True):
                    continue
                
                item_frame = tk.Frame(list_frame, relief=tk.RIDGE, borderwidth=1)
                item_frame.pack(fill=tk.X, pady=5)
                
                info_text = f"📝 {sched['topic']}\n   Kategori: {sched['category']} | Frekvens: {sched['frequency']}"
                
                tk.Label(
                    item_frame,
                    text=info_text,
                    font=("Arial", 9),
                    justify=tk.LEFT
                ).pack(side=tk.LEFT, padx=10, pady=5)
                
                # Delete button
                def delete_schedule(idx=i):
                    self.schedule[idx]['active'] = False
                    save_schedule(self.schedule)
                    schedule_window.destroy()
                    self.update_schedule_display()
                    messagebox.showinfo("Info", "Schema inaktiverat")
                
                tk.Button(
                    item_frame,
                    text="🗑️ Ta bort",
                    command=delete_schedule,
                    font=("Arial", 8),
                    bg="#e74c3c",
                    fg="white"
                ).pack(side=tk.RIGHT, padx=10, pady=5)
        
        # Close button
        tk.Button(
            schedule_window,
            text="Stäng",
            command=schedule_window.destroy,
            font=("Arial", 10),
            padx=20,
            pady=5
        ).pack(pady=20)

############################################################
# Main
############################################################
def main():
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "API Key Saknas",
            "OPENAI_API_KEY hittades inte i .env-filen!\n\n"
            "Kontrollera att .env finns i projektets root och innehåller:\n"
            "OPENAI_API_KEY=din-nyckel-här"
        )
        return
    
    root = tk.Tk()
    app = BlogGeneratorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()

