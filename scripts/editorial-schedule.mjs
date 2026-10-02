import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import editorial from '../config/editorial.js';

const root = process.cwd();
const statePath = path.join(root, 'data', 'editorial-schedule.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const validSlug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const dateString = value => value instanceof Date ? value.toISOString().slice(0, 10) : value;
const nextWeek = value => {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString().slice(0, 10);
};
if (state.version !== 3 || state.mode !== 'weekly-generation' || state.timezone !== 'Europe/Stockholm'
  || !validDate(state.nextArticleDate) || !Array.isArray(state.weeklyPublished)
  || state.weeklyPublished.some(item => !validSlug(item.slug) || !validDate(item.date))
  || new Set(state.weeklyPublished.map(item => item.slug)).size !== state.weeklyPublished.length
  || (state.weeklyPublished.length === 0 && (state.lastArticleDate !== null || state.lastArticleSlug !== null))
  || (state.weeklyPublished.length > 0 && (state.lastArticleDate !== state.weeklyPublished.at(-1).date
    || state.lastArticleSlug !== state.weeklyPublished.at(-1).slug
    || state.nextArticleDate < nextWeek(state.lastArticleDate)))) {
  throw new Error('Invalid weekly schedule; review the state before continuing');
}
const due = today >= state.nextArticleDate;
const [command = 'status', slug] = process.argv.slice(2);
if (command === 'status') {
  console.log(JSON.stringify({ today, due, nextArticleDate: state.nextArticleDate,
    lastArticleDate: state.lastArticleDate, lastArticleSlug: state.lastArticleSlug }));
} else if (command === 'record') {
  if (!validSlug(slug)) throw new Error('A valid new article slug is required');
  if (state.weeklyPublished.some(item => item.slug === slug)) {
    console.log(JSON.stringify({ recorded: false, reason: 'Already recorded', nextArticleDate: state.nextArticleDate }));
  } else {
    if (!due) throw new Error('A weekly article is not due yet');
    if (state.initialBatch?.slugs?.includes(slug)) throw new Error('An existing batch article cannot be recorded as a new weekly article');
    const articlePath = path.join(root, 'content', 'posts', `${slug}.md`);
    const { data, content } = matter(fs.readFileSync(articlePath, 'utf8'));
    if (data.draft !== false || dateString(data.date) !== today || dateString(data.modifiedDate) !== today
      || data.automation !== 'dg97-weekly-guide' || data.author !== 'DG97 Kontorsguiden'
      || !data.title || !data.excerpt || !data.featuredImageAlt
      || !editorial.GUIDE_CATEGORIES.some(category => category.slug === data.category)
      || !/^\/images\/[a-zA-Z0-9_.-]+\.(?:jpg|jpeg|png|webp)$/.test(data.featuredImage || '')
      || !fs.existsSync(path.join(root, 'public', data.featuredImage))
      || !Array.isArray(data.sources) || !data.sources.length
      || data.sources.some(source => typeof source !== 'string' || !source.startsWith('https://'))
      || content.trim().split(/\s+/).length < 250
      || /\b\d[\d\s.,]*\s*(?:kr|SEK)\b/.test(content)) {
      throw new Error('Only a complete new weekly article with verified metadata, image and sources can advance the schedule');
    }
    const nextState = { ...state, lastArticleDate: today, lastArticleSlug: slug,
      nextArticleDate: nextWeek(today), weeklyPublished: [...state.weeklyPublished, { slug, date: today }] };
    const temporaryPath = `${statePath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(nextState, null, 2)}\n`);
    fs.renameSync(temporaryPath, statePath);
    console.log(JSON.stringify({ recorded: true, slug, date: today, nextArticleDate: nextState.nextArticleDate }));
  }
} else {
  throw new Error('Use status or record <slug>');
}
