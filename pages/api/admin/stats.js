/**
 * Admin Dashboard Stats API
 *
 * Provides statistics for admin dashboard
 */

import { verifyAdminToken } from './auth';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const stats = await getStats();
      return res.status(200).json(stats);
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching stats:', error);
      }
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Get dashboard statistics
 */
async function getStats() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const scheduleFile = path.join(process.cwd(), 'blog_generator', 'schedule.json');

  let postCount = 0;
  let recentPosts = 0;
  let scheduledCount = 0;
  let activeSchedules = 0;

  // Count posts
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    postCount = files.length;

    // Count recent posts (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    recentPosts = files.filter(file => {
      const filePath = path.join(postsDir, file);
      const stats = fs.statSync(filePath);
      return stats.mtime.getTime() > weekAgo;
    }).length;
  }

  // Count schedules
  if (fs.existsSync(scheduleFile)) {
    try {
      const content = fs.readFileSync(scheduleFile, 'utf-8');
      try {
        const schedules = JSON.parse(content);
        scheduledCount = schedules.length;
        activeSchedules = schedules.filter(s => s.active !== false).length;
      } catch (parseError) {
        // Invalid JSON - ignore silently
        if (process.env.NODE_ENV === 'development') {
          console.error('Error parsing schedule JSON:', parseError);
        }
      }
    } catch (e) {
      // Ignore read errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading schedule file:', e);
      }
    }
  }

  return {
    posts: {
      total: postCount,
      recent: recentPosts
    },
    schedules: {
      total: scheduledCount,
      active: activeSchedules
    },
    system: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasGithub: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)
    }
  };
}

