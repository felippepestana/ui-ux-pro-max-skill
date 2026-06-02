#!/usr/bin/env node
/**
 * collect-instagram.cjs — pulls public posts and reels from Instagram profiles
 * into content/destemidos-pioneiros/media/.
 *
 * Usage:
 *   INSTAGRAM_SESSION_ID=… node scripts/collect-instagram.cjs @legendariosportovelho
 *
 * Behavior:
 *   - With a session cookie, calls Instagram's web profile endpoint
 *     authenticated and downloads media + captions for the first page of posts.
 *   - Without a session cookie, prints a checklist and exits without writing.
 *
 * This is a thin skeleton: production scraping needs pagination, rate limiting,
 * and care with Instagram's TOS. Treat as a starting point.
 */
const fs    = require('fs');
const path  = require('path');
const https = require('https');

const REPO_ROOT  = path.resolve(__dirname, '..');
const MEDIA_ROOT = path.join(REPO_ROOT, 'content', 'destemidos-pioneiros', 'media');
const PHOTOS_DIR = path.join(MEDIA_ROOT, 'photos');
const VIDEOS_DIR = path.join(MEDIA_ROOT, 'videos');
const INVENTORY  = path.join(MEDIA_ROOT, '_INVENTORY.md');

const SESSION = process.env.INSTAGRAM_SESSION_ID;

const handleArg = process.argv[2];
if (!handleArg) {
  console.error('usage: INSTAGRAM_SESSION_ID=… node scripts/collect-instagram.cjs <@handle>');
  process.exit(1);
}
const handle = handleArg.replace(/^@/, '');

if (!SESSION) {
  console.log(`[collect-instagram] no INSTAGRAM_SESSION_ID set — printing manual checklist for @${handle}`);
  console.log(`See ${path.relative(process.cwd(), INVENTORY)} for the URL list.`);
  console.log('\nTo enable automated collection:');
  console.log('  1. Open instagram.com in a logged-in browser');
  console.log('  2. Copy the value of the `sessionid` cookie');
  console.log('  3. Re-run: INSTAGRAM_SESSION_ID="…" node scripts/collect-instagram.cjs ' + handleArg);
  process.exit(0);
}

function get(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout: 15000 }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error(`Request timed out: ${url}`)));
    req.on('error', reject);
  });
}

async function downloadTo(url, destPath) {
  const res = await get(url, { 'User-Agent': 'Mozilla/5.0' });
  if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${url}`);
  fs.writeFileSync(destPath, res.body);
}

async function fetchProfile(user) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}`;
  const res = await get(url, {
    'User-Agent': 'Mozilla/5.0',
    'x-ig-app-id': '936619743392459',
    'Cookie': `sessionid=${SESSION}`,
  });
  if (res.status !== 200) throw new Error(`Profile fetch failed: HTTP ${res.status}`);
  return JSON.parse(res.body.toString('utf8'));
}

(async () => {
  try {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });

    console.log(`[collect-instagram] fetching @${handle}…`);
    const data  = await fetchProfile(handle);
    const user  = data?.data?.user;
    if (!user) throw new Error('Profile not found in response payload');

    const posts = user.edge_owner_to_timeline_media?.edges || [];
    console.log(`[collect-instagram] ${posts.length} posts visible on first page`);

    const log = [];
    for (const { node } of posts) {
      const shortcode = node.shortcode;
      const isVideo   = node.is_video;
      const url       = node.video_url || node.display_url;
      const caption   = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
      const ext       = isVideo ? '.mp4' : '.jpg';
      const dest      = path.join(isVideo ? VIDEOS_DIR : PHOTOS_DIR, `${handle}-${shortcode}${ext}`);

      try {
        await downloadTo(url, dest);
        log.push({ shortcode, type: isVideo ? 'video' : 'photo', file: path.relative(REPO_ROOT, dest), caption: caption.slice(0, 180) });
        console.log(`  ✓ ${shortcode} → ${path.relative(REPO_ROOT, dest)}`);
      } catch (err) {
        console.warn(`  ✗ ${shortcode}: ${err.message}`);
      }
    }

    const logPath = path.join(MEDIA_ROOT, `_log-${handle}.json`);
    fs.writeFileSync(logPath, JSON.stringify({ handle, fetched_at: new Date().toISOString(), posts: log }, null, 2));
    console.log(`[collect-instagram] log → ${path.relative(REPO_ROOT, logPath)}`);
  } catch (err) {
    console.error('[collect-instagram] failed:', err.message);
    process.exit(1);
  }
})();
