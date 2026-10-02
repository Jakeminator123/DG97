/**
 * Admin Blog Management API
 *
 * Endpoints for managing blog posts, schedules, and generation
 */

import { verifyAdminToken } from "./auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(503).json({ error: 'Redigering är pausad. Publicera blogginlägg via GitHub.' });

  // Get blog posts
  if (req.method === "GET") {
    try {
      const { slug } = req.query;
      if (slug !== undefined && (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug))) {
        return res.status(400).json({ error: 'Invalid slug' });
      }
      const postsDir = path.join(process.cwd(), "content", "posts");

      if (!fs.existsSync(postsDir)) {
        return res.status(200).json({ posts: [] });
      }

      // Get single post
      if (slug) {
        const filePath = path.join(postsDir, `${slug}.md`);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: "Post not found" });
        }
        const content = fs.readFileSync(filePath, "utf-8");
        const { frontmatter, body } = ({ frontmatter: matter(content).data, body: matter(content).content });
        return res.status(200).json({
          slug,
          title: frontmatter.title || "",
          date: frontmatter.date || "",
          excerpt: frontmatter.excerpt || "",
          category: frontmatter.category || "allmänt",
          featuredImage: frontmatter.featuredImage || "",
          content: body,
          ...frontmatter,
        });
      }

      // Get all posts
      const posts = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
          const filePath = path.join(postsDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const { frontmatter, body } = ({ frontmatter: matter(content).data, body: matter(content).content });

          return {
            slug: file.replace(".md", ""),
            title: frontmatter.title || "",
            date: frontmatter.date || "",
            excerpt: frontmatter.excerpt || "",
            category: frontmatter.category || "allmänt",
            featuredImage: frontmatter.featuredImage || "",
            content: body,
            ...frontmatter,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.status(200).json({ posts });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching posts:", error);
      }
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  }

}
