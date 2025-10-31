import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full);
    } else if (e.isFile() && exts.has(path.extname(e.name))) {
      stripCommentsFromFile(full);
    }
  }
}

function stripCommentsFromFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const original = src;

  // Remove block comments /* ... */ (non-greedy)
  src = src.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments // ... (but not in strings or regex) - approximate
  // Approach: remove // comments that are not preceded by ':' (to avoid http://) and not inside quotes is hard with regex.
  // We'll use a simple state machine to avoid removing // inside strings.

  let out = '';
  let i = 0;
  const len = src.length;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let inRegex = false;
  let prev = '';

  while (i < len) {
    const ch = src[i];
    const ch2 = src[i + 1];

    if (!inSingle && !inDouble && !inBacktick && ch === '/' && ch2 === '/') {
      // skip until end of line
      i += 2;
      while (i < len && src[i] !== '\n') i++;
      continue;
    }

    if (!inSingle && !inDouble && !inBacktick && ch === '/' && ch2 === '*') {
      // already removed block comments earlier, but keep safe: skip until */
      i += 2;
      while (i < len && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // manage string starts/ends, with escapes
    if (ch === "'" && !inDouble && !inBacktick) {
      out += ch;
      inSingle = !inSingle;
      i++;
      // copy until end of single-quoted string
      while (i < len) {
        const c = src[i];
        out += c;
        if (c === "'" && src[i - 1] !== '\\') { inSingle = false; i++; break; }
        i++;
      }
      continue;
    }

    if (ch === '"' && !inSingle && !inBacktick) {
      out += ch;
      inDouble = !inDouble;
      i++;
      while (i < len) {
        const c = src[i];
        out += c;
        if (c === '"' && src[i - 1] !== '\\') { inDouble = false; i++; break; }
        i++;
      }
      continue;
    }

    if (ch === '`' && !inSingle && !inDouble) {
      out += ch;
      inBacktick = !inBacktick;
      i++;
      while (i < len) {
        const c = src[i];
        out += c;
        if (c === '`' && src[i - 1] !== '\\') { inBacktick = false; i++; break; }
        i++;
      }
      continue;
    }

    // default: copy char
    out += ch;
    i++;
  }

  // Trim multiple blank lines to at most two
  out = out.replace(/\n{3,}/g, '\n\n');

  if (out !== original) {
    fs.writeFileSync(filePath, out, 'utf8');
    console.log('Stripped comments from', path.relative(process.cwd(), filePath));
  }
}

walk(root);
console.log('Done stripping comments.');
