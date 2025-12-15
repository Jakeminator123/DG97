/**
 * Admin Content Management API
 * Manage site content (texts, images)
 */

import { verifyAdminToken } from './auth';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site_content.json');

// Ensure data directory exists
const dataDir = path.dirname(CONTENT_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get content
  if (req.method === 'GET') {
    try {
      const content = loadContent();
      return res.status(200).json(content);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading content:', error);
      }
      return res.status(500).json({ error: 'Failed to load content' });
    }
  }

  // Update content
  if (req.method === 'PUT') {
    try {
      const { key, value } = req.body;

      if (!key) {
        return res.status(400).json({ error: 'Key required' });
      }

      const content = loadContent();
      content[key] = value;
      content.updatedAt = new Date().toISOString();

      saveContent(content);
      return res.status(200).json({ success: true, content });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating content:', error);
      }
      return res.status(500).json({ error: 'Failed to update content' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function loadContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading content:', e);
    }
  }
  // Default content structure
  return {
    heroTitle: 'Välkommen till DG97 Kontorshotell',
    heroSubtitle: 'Flexibla kontorslösningar i hjärtat av Stockholm',
    aboutText: 'DG97 är ett modernt kontorshotell som erbjuder flexibla kontorslösningar för företag av alla storlekar.',
    contactEmail: 'hej@dg97.se',
    contactPhone: '070-886 22 79',
    address: 'Drottninggatan 97, 113 60 Stockholm',
    updatedAt: new Date().toISOString()
  };
}

function saveContent(content) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

