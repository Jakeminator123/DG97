import fs from 'node:fs';
import path from 'node:path';
import { randomInt } from 'node:crypto';
import matter from 'gray-matter';

const root = process.cwd();
const statePath = path.join(root, 'data', 'editorial-schedule.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const validSlug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
if (state.version !== 2 || state.mode !== 'publish' || state.timezone !== 'Europe/Stockholm'
  || !Array.isArray(state.queue) || !Array.isArray(state.released)
  || state.queue.some(slug => !validSlug(slug)) || new Set(state.queue).size !== state.queue.length
  || state.released.some(item => !validSlug(item.slug) || !validDate(item.date) || state.queue.includes(item.slug))
  || new Set(state.released.map(item => item.slug)).size !== state.released.length
  || (state.queue.length && !validDate(state.nextReleaseDate))) {
  throw new Error('Invalid editorial schedule; review the state before continuing');
}
const due = state.queue.length > 0 && today >= state.nextReleaseDate;
const summary = () => ({ today, due, complete: state.queue.length === 0, remaining: state.queue.length,
  nextReleaseDate: state.nextReleaseDate, nextSlug: state.queue[0] || null });
const atomicWrite = (filePath, value) => {
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, value);
  fs.renameSync(temporaryPath, filePath);
};
const [command = 'status'] = process.argv.slice(2);
if (command === 'status') {
  console.log(JSON.stringify(summary()));
} else if (command === 'release') {
  if (!due) {
    console.log(JSON.stringify({ published: false, ...summary() }));
  } else {
    const slug = state.queue[0];
    const articlePath = path.join(root, 'content', 'posts', `${slug}.md`);
    const { data, content } = matter(fs.readFileSync(articlePath, 'utf8'));
    const publishedDate = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
    // Recover the same article if a previous run wrote it but did not advance the queue.
    const recovering = data.draft === false && validDate(publishedDate)
      && publishedDate >= state.nextReleaseDate && publishedDate <= today;
    if ((!recovering && data.draft !== true) || !data.title || !data.excerpt || !data.author
      || !data.featuredImageAlt || !/^\/images\/[a-zA-Z0-9_.-]+\.(?:jpg|jpeg|png|webp)$/.test(data.featuredImage || '')
      || !fs.existsSync(path.join(root, 'public', data.featuredImage))
      || !Array.isArray(data.sources) || !data.sources.length
      || data.sources.some(source => typeof source !== 'string' || !source.startsWith('https://'))
      || content.trim().split(/\s+/).length < 250) {
      throw new Error('Only a complete queued article with a real image and sources can be published');
    }
    const releaseDate = recovering ? publishedDate : today;
    if (!recovering) {
      atomicWrite(articlePath, matter.stringify(content, { ...data, draft: false, date: today, modifiedDate: today }));
    }
    const queue = state.queue.slice(1);
    const intervalDays = queue.length ? randomInt(4, 7) : null;
    // Count the next interval from this run, even after recovering a delayed run.
    const nextDate = new Date(`${today}T12:00:00Z`);
    if (intervalDays) nextDate.setUTCDate(nextDate.getUTCDate() + intervalDays);
    const nextState = { ...state, queue, intervalDays,
      nextReleaseDate: queue.length ? nextDate.toISOString().slice(0, 10) : null,
      released: [...state.released, { slug, date: releaseDate }] };
    atomicWrite(statePath, `${JSON.stringify(nextState, null, 2)}\n`);
    console.log(JSON.stringify({ published: true, recovered: recovering, slug, date: releaseDate,
      remaining: queue.length, nextReleaseDate: nextState.nextReleaseDate, intervalDays }));
  }
} else {
  throw new Error('Use status or release');
}
