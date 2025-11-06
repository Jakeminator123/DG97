/**
 * Admin Scheduler Runner API
 *
 * Manually trigger scheduled blog post generation
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
      // Run scheduler check
      const result = await runSchedulerCheck();

      return res.status(200).json({
        success: true,
        message: 'Scheduler check completed',
        result
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Scheduler error:', error);
      }
      return res.status(500).json({ error: error.message || 'Failed to run scheduler' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Run scheduler check
 */
async function runSchedulerCheck() {
  return new Promise((resolve, reject) => {
    const schedulerPath = path.join(process.cwd(), 'blog_generator', 'scheduler.py');

    if (!fs.existsSync(schedulerPath)) {
      return resolve({
        success: false,
        error: 'Scheduler script not found'
      });
    }

    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    // Fix scheduler path import
    const scriptCode = `
import sys
import os
sys.path.insert(0, r'${path.join(process.cwd(), 'blog_generator').replace(/\\/g, '/')}')
os.chdir(r'${process.cwd().replace(/\\/g, '/')}')

from scheduler import check_and_generate

try:
    check_and_generate()
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {str(e)}")
    sys.exit(1)
`;

    const scriptPath = path.join(process.cwd(), 'temp_scheduler.py');
    fs.writeFileSync(scriptPath, scriptCode);

    const pythonProcess = spawn(pythonCmd, [scriptPath], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      shell: process.platform === 'win32'
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Timeout after 10 minutes
    const timeoutId = setTimeout(() => {
      if (!pythonProcess.killed) {
        pythonProcess.kill();
      }
      // Clean up temp file
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      resolve({
        success: false,
        error: 'Scheduler check timed out (over 10 minutes)'
      });
    }, 600000);

    pythonProcess.on('close', (code) => {
      clearTimeout(timeoutId);

      // Clean up temp file immediately
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }

      if (code !== 0) {
        return resolve({
          success: false,
          error: stderr || 'Scheduler check failed',
          code,
          stdout
        });
      }

      resolve({
        success: true,
        output: stdout,
        stderr
      });
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
        error: `Failed to start Python: ${error.message}`
      });
    });
  });
}

