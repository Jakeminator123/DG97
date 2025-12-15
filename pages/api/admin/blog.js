/**
 * Admin Blog Management API
 *
 * Endpoints for managing blog posts, schedules, and generation
 */

import { verifyAdminToken } from "./auth";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get blog posts
  if (req.method === "GET") {
    try {
      const { slug } = req.query;
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
        const { frontmatter, body } = parseMarkdown(content);
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
      const files = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
          const filePath = path.join(postsDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const { frontmatter, body } = parseMarkdown(content);

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

  // Create blog post
  if (req.method === "POST") {
    try {
      const { title, content, excerpt, category, featuredImage, date } =
        req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content required" });
      }

      const postsDir = path.join(process.cwd(), "content", "posts");
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }

      let slug = createSlug(title);
      const postDate = date || new Date().toISOString().split("T")[0];

      // Check if slug already exists and generate unique one if needed
      let filePath = path.join(postsDir, `${slug}.md`);
      let counter = 1;
      while (fs.existsSync(filePath)) {
        slug = `${createSlug(title)}-${counter}`;
        filePath = path.join(postsDir, `${slug}.md`);
        counter++;

        // Prevent infinite loop (max 1000 attempts)
        if (counter > 1000) {
          return res
            .status(500)
            .json({ error: "Failed to generate unique slug" });
        }
      }

      const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${postDate}"
excerpt: "${(excerpt || content.substring(0, 150)).replace(/"/g, '\\"')}"
category: "${category || "allmänt"}"
${featuredImage ? `featuredImage: "${featuredImage}"` : ""}
---

`;

      const fullContent = frontmatter + content;

      fs.writeFileSync(filePath, fullContent, "utf-8");

      return res.status(200).json({
        success: true,
        slug,
        message: "Post created",
        warning:
          counter > 1
            ? `Slug adjusted to ${slug} (original was taken)`
            : undefined,
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error creating post:", error);
      }
      return res.status(500).json({ error: "Failed to create post" });
    }
  }

  // Update blog post
  if (req.method === "PUT") {
    try {
      const { slug, title, content, excerpt, category, featuredImage, date } =
        req.body;

      if (!slug) {
        return res.status(400).json({ error: "Slug required" });
      }

      const filePath = path.join(
        process.cwd(),
        "content",
        "posts",
        `${slug}.md`
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Post not found" });
      }

      const postDate = date || new Date().toISOString().split("T")[0];

      const frontmatter = `---
title: "${(title || "").replace(/"/g, '\\"')}"
date: "${postDate}"
excerpt: "${(excerpt || content?.substring(0, 150) || "").replace(/"/g, '\\"')}"
category: "${category || "allmänt"}"
${featuredImage ? `featuredImage: "${featuredImage}"` : ""}
---

`;

      const fullContent = frontmatter + (content || "");
      fs.writeFileSync(filePath, fullContent, "utf-8");

      return res.status(200).json({
        success: true,
        message: "Post updated",
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating post:", error);
      }
      return res.status(500).json({ error: "Failed to update post" });
    }
  }

  // Delete blog post
  if (req.method === "DELETE") {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: "Slug required" });
      }

      const filePath = path.join(
        process.cwd(),
        "content",
        "posts",
        `${slug}.md`
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).json({ success: true, message: "Post deleted" });
      }

      return res.status(404).json({ error: "Post not found" });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting post:", error);
      }
      return res.status(500).json({ error: "Failed to delete post" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parse markdown frontmatter
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter = {};
  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}
