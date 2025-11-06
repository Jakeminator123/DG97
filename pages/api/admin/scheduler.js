/**
 * Admin Scheduler API
 *
 * Manage automatic blog post scheduling
 */

import { verifyAdminToken } from './auth';
import fs from 'fs';
import path from 'path';

const SCHEDULE_FILE = path.join(process.cwd(), 'blog_generator', 'schedule.json');

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get schedules
  if (req.method === 'GET') {
    try {
      const schedules = loadSchedule();
      return res.status(200).json({ schedules });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading schedules:', error);
      }
      return res.status(500).json({ error: 'Failed to load schedules' });
    }
  }

  // Create schedule
  if (req.method === 'POST') {
    try {
      const { category, topic, frequency } = req.body;

      if (!category || !topic || !frequency) {
        return res.status(400).json({ error: 'Category, topic, and frequency are required' });
      }

      const schedules = loadSchedule();

      const newSchedule = {
        category,
        topic,
        frequency,
        created: new Date().toISOString(),
        active: true,
        last_post: null
      };

      schedules.push(newSchedule);
      saveSchedule(schedules);

      return res.status(200).json({
        success: true,
        schedule: newSchedule
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating schedule:', error);
      }
      return res.status(500).json({ error: 'Failed to create schedule' });
    }
  }

  // Update schedule
  if (req.method === 'PUT') {
    try {
      const { id, active, ...updates } = req.body;

      if (id === undefined) {
        return res.status(400).json({ error: 'Schedule ID required' });
      }

      const schedules = loadSchedule();
      const index = parseInt(id);

      if (index < 0 || index >= schedules.length) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      schedules[index] = {
        ...schedules[index],
        ...updates,
        active: active !== undefined ? active : schedules[index].active
      };

      saveSchedule(schedules);

      return res.status(200).json({
        success: true,
        schedule: schedules[index]
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating schedule:', error);
      }
      return res.status(500).json({ error: 'Failed to update schedule' });
    }
  }

  // Delete schedule
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (id === undefined) {
        return res.status(400).json({ error: 'Schedule ID required' });
      }

      const schedules = loadSchedule();
      const index = parseInt(id);

      if (index < 0 || index >= schedules.length) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      schedules[index].active = false;
      saveSchedule(schedules);

      return res.status(200).json({ success: true });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting schedule:', error);
      }
      return res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Load schedule from file
 */
function loadSchedule() {
  try {
    if (fs.existsSync(SCHEDULE_FILE)) {
      const content = fs.readFileSync(SCHEDULE_FILE, 'utf-8');
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Invalid JSON - return empty array and log error
        if (process.env.NODE_ENV === 'development') {
          console.error('Error parsing schedule JSON:', parseError);
        }
        return [];
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading schedule:', error);
    }
  }
  return [];
}

/**
 * Save schedule to file
 */
function saveSchedule(schedules) {
  try {
    const dir = path.dirname(SCHEDULE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2), 'utf-8');
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving schedule:', error);
    }
    throw error;
  }
}

