/**
 * Newsletter Subscription API
 * Public endpoint for newsletter signups
 */

import fs from 'fs';
import path from 'path';

const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter_subscribers.json');

// Ensure data directory exists
const dataDir = path.dirname(NEWSLETTER_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'E-postadress krävs' });
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ogiltig e-postadress' });
    }

    // Load existing subscribers
    let subscribers = [];
    if (fs.existsSync(NEWSLETTER_FILE)) {
      try {
        const content = fs.readFileSync(NEWSLETTER_FILE, 'utf-8');
        subscribers = JSON.parse(content);
      } catch (e) {
        // File corrupted, start fresh
        subscribers = [];
      }
    }

    // Check if already subscribed
    const normalizedEmail = email.toLowerCase().trim();
    const exists = subscribers.some(s => s.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return res.status(200).json({
        success: true,
        message: 'Du är redan prenumerant!',
        alreadySubscribed: true
      });
    }

    // Add new subscriber
    const newSubscriber = {
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      active: true,
      source: 'website'
    };

    subscribers.push(newSubscriber);

    // Save to file
    fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');

    return res.status(200).json({
      success: true,
      message: 'Tack för din prenumeration!'
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Newsletter subscription error:', error);
    }
    return res.status(500).json({ error: 'Ett fel uppstod. Försök igen senare.' });
  }
}

