#!/usr/bin/env node
/* Makes a password hash for the admin users table (see schema.sql).

     node scripts/hash-password.mjs

   Asks for the password twice (nothing is shown as you type), then prints the
   hash and an INSERT to paste into the D1 Console. The password is never saved.
   The hash format matches worker/auth.js: pbkdf2$<iterations>$<salt>$<hash>. */

import { pbkdf2Sync, randomBytes } from 'node:crypto';

const ITERATIONS = 100000; // must not exceed the Workers PBKDF2 limit (100,000)
const MIN_LENGTH = 12;

function readHidden(prompt) {
  return new Promise(resolve => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      console.error('Run this in a terminal so the password can be typed privately.');
      process.exit(1);
    }
    process.stdout.write(prompt);
    let input = '';
    const onData = chunk => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') { finish(); return; }
        if (ch === '\u0003') { cleanup(); process.stdout.write('\n'); process.exit(130); } // Ctrl+C
        if (ch === '\u007f' || ch === '\b') { input = input.slice(0, -1); continue; }   // Backspace
        input += ch;
      }
    };
    const cleanup = () => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    const finish = () => {
      cleanup();
      process.stdout.write('\n');
      resolve(input);
    };
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.resume();
    stdin.on('data', onData);
  });
}

const password = await readHidden('Password: ');
if (password.length < MIN_LENGTH) {
  console.error(`Use at least ${MIN_LENGTH} characters.`);
  process.exit(1);
}
if (password !== await readHidden('Repeat password: ')) {
  console.error('The passwords do not match.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
const stored = `pbkdf2$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`;

console.log(`
Hash:
${stored}

Paste into the D1 Console (change the email, name and role first):

INSERT INTO users (email, name, role, password_hash)
VALUES ('you@example.com', 'Your Name', 'superadmin', '${stored}');

Roles: superadmin, editor, viewer.
To change an existing user's password instead:
UPDATE users SET password_hash = '${stored}' WHERE email = 'you@example.com';
`);
