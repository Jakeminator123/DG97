/**
 * Admin Newsletter Management API
 * Manage subscribers and send newsletters
 */

import { verifyAdminToken } from './auth';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'newsletter_subscribers.json');
const SEND_HISTORY_FILE = path.join(process.cwd(), 'data', 'newsletter_history.json');

// Ensure data directory exists
const dataDir = path.dirname(SUBSCRIBERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get subscribers
  if (req.method === 'GET') {
    try {
      const subscribers = loadSubscribers();
      const history = loadHistory();

      return res.status(200).json({
        subscribers,
        history: history.slice(0, 50), // Last 50 sends
        total: subscribers.length,
        active: subscribers.filter(s => s.active !== false).length
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading newsletter data:', error);
      }
      return res.status(500).json({ error: 'Failed to load newsletter data' });
    }
  }

  // Delete subscriber
  if (req.method === 'DELETE') {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      const subscribers = loadSubscribers();
      const filtered = subscribers.filter(s => s.email.toLowerCase() !== email.toLowerCase());

      if (filtered.length === subscribers.length) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      saveSubscribers(filtered);
      return res.status(200).json({ success: true });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting subscriber:', error);
      }
      return res.status(500).json({ error: 'Failed to delete subscriber' });
    }
  }

  // Send newsletter
  if (req.method === 'POST') {
    try {
      const { subject, content, testEmail } = req.body;

      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content required' });
      }

      const subscribers = loadSubscribers();
      const activeSubscribers = subscribers.filter(s => s.active !== false);

      if (activeSubscribers.length === 0) {
        return res.status(400).json({ error: 'No active subscribers' });
      }

      // If test email, send only to that address
      if (testEmail) {
        // In production, send test email via SMTP
        // For now, just log it
        if (process.env.NODE_ENV === 'development') {
          console.log('Test email would be sent to:', testEmail);
          console.log('Subject:', subject);
          console.log('Content:', content.substring(0, 100) + '...');
        }

        return res.status(200).json({
          success: true,
          message: 'Test email sent (check console in dev)',
          sent: 1
        });
      }

      // Send to all active subscribers
      // In production, integrate with SMTP service (nodemailer, SendGrid, etc.)
      const sendResult = {
        success: true,
        sent: activeSubscribers.length,
        failed: 0,
        timestamp: new Date().toISOString()
      };

      // Save to history
      const history = loadHistory();
      history.unshift({
        subject,
        content: content.substring(0, 200) + '...', // Store preview
        sent: sendResult.sent,
        failed: sendResult.failed,
        timestamp: sendResult.timestamp
      });
      saveHistory(history.slice(0, 100)); // Keep last 100

      return res.status(200).json(sendResult);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending newsletter:', error);
      }
      return res.status(500).json({ error: 'Failed to send newsletter' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function loadSubscribers() {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const content = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading subscribers:', e);
    }
  }
  return [];
}

function saveSubscribers(subscribers) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

function loadHistory() {
  try {
    if (fs.existsSync(SEND_HISTORY_FILE)) {
      const content = fs.readFileSync(SEND_HISTORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading history:', e);
    }
  }
  return [];
}

function saveHistory(history) {
  fs.writeFileSync(SEND_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

