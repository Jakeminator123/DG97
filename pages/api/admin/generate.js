/**
 * Admin Blog Generator API
 *
 * Integrates with Python blog_generator
 * Generates blog posts using AI
 */

import { verifyAdminToken } from './auth';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { title, category, autoPublish = false } = req.body;

      if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required' });
      }

      // Call Python blog generator
      const result = await generateBlogPost(title, category, autoPublish);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(500).json({ error: result.error || 'Failed to generate post' });
      }
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Blog generation error:', error);
      }
      return res.status(500).json({ error: error.message || 'Failed to generate blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Generate blog post using Python script
 */
async function generateBlogPost(title, category, autoPublish) {
  return new Promise((resolve) => {
    const blogGenPath = path.join(process.cwd(), 'blog_generator');

    if (!fs.existsSync(blogGenPath)) {
      return resolve({
        success: false,
        error: 'Blog generator directory not found'
      });
    }

    // Create Python script to call generator
    // Escape single quotes, backslashes, and newlines for Python string
    const escapedTitle = title
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/'/g, "\\'")     // Escape single quotes
      .replace(/\n/g, '\\n')    // Escape newlines
      .replace(/\r/g, '\\r');   // Escape carriage returns

    const scriptCode = `
import sys
import os
sys.path.insert(0, r'${blogGenPath.replace(/\\/g, '/')}')
os.chdir(r'${process.cwd().replace(/\\/g, '/')}')

from dg97_blog_gen import generate_post, create_slug, publish_to_site
import json

try:
    # Generate post (auto_publish=True skips the input prompt)
    result = generate_post('${escapedTitle}', '${category}', auto_publish=${autoPublish ? 'True' : 'False'})

    if result:
        slug = create_slug('${escapedTitle}')
        print(json.dumps({'success': True, 'filepath': result, 'slug': slug}))
    else:
        print(json.dumps({'success': False, 'error': 'Generation failed'}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`;

    const scriptPath = path.join(process.cwd(), 'temp_generate.py');

    // Timeout reference
    var timeoutId = null;

    try {
      fs.writeFileSync(scriptPath, scriptCode, 'utf-8');
    } catch (writeError) {
      return resolve({
        success: false,
        error: 'Failed to create temporary script file'
      });
    }

    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const pythonProcess = spawn(pythonCmd, [scriptPath], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      shell: process.platform === 'win32'
    });

    let stdout = '';
    let stderr = '';
    let hasOutput = false;

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      hasOutput = true;
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Timeout after 5 minutes
    timeoutId = setTimeout(() => {
      if (!pythonProcess.killed) {
        pythonProcess.kill();
      }
      // Clean up temp file on timeout
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      resolve({
        success: false,
        error: 'Generation timed out (over 5 minutes)'
      });
    }, 300000);

    pythonProcess.on('close', (code) => {
      // Clear timeout if process completes
      clearTimeout(timeoutId);

      // Clean up temp file immediately
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        // Ignore cleanup errors - will be cleaned up eventually
      }

      // Try to parse JSON from stdout
      const jsonMatch = stdout.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          resolve(result);
          return;
        } catch (parseError) {
          // JSON parse failed - continue to error handling
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to parse JSON from Python output:', parseError);
          }
        }
      }

      // If no JSON found, check for errors
      if (code !== 0 || stderr) {
        resolve({
          success: false,
          error: stderr || 'Python script failed',
          code,
          stdout
        });
      } else if (hasOutput) {
        // Success but couldn't parse JSON
        resolve({
          success: true,
          message: 'Post generated (check output)',
          stdout
        });
      } else {
        resolve({
          success: false,
          error: 'No output from generator'
        });
      }
    });

    pythonProcess.on('error', (error) => {
      clearTimeout(timeoutId);
      // Clean up temp file on error
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      resolve({
        success: false,
        error: `Failed to start Python: ${error.message}. Make sure Python is installed and in PATH.`
      });
    });
  });
}

