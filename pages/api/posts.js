import { getPosts } from '../../lib/posts';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    return res.status(200).json(getPosts());
  } catch {
    return res.status(500).json({ error: 'Failed to load posts' });
  }
}
