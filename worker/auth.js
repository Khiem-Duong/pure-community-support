/* Password and session helpers for the admin sign-in.

   Password hashes are stored as  pbkdf2$<iterations>$<salt>$<hash>
   (PBKDF2-SHA-256, 16-byte salt, 32-byte hash, standard base64).
   scripts/hash-password.mjs produces the same format. */

const ITERATIONS = 100000; // the most Workers allow for PBKDF2
const encoder = new TextEncoder();

const toBase64 = bytes => btoa(String.fromCharCode(...bytes));
const fromBase64 = text => Uint8Array.from(atob(text), ch => ch.charCodeAt(0));

/* Checked against when the email is unknown, so a wrong email takes as long as a wrong password. */
export const DUMMY_HASH = `pbkdf2$${ITERATIONS}$${'A'.repeat(22)}==$${'A'.repeat(43)}=`;

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > ITERATIONS) return false;
  let salt, expected;
  try {
    salt = fromBase64(parts[2]);
    expected = fromBase64(parts[3]);
  } catch (err) {
    return false;
  }
  return timingSafeEqual(await derive(password, salt, iterations), expected);
}

/* Random session token for the cookie (base64url, 256 bits). */
export function newSessionToken() {
  return toBase64(crypto.getRandomValues(new Uint8Array(32)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* Session tokens are stored hashed, so a database leak does not expose live sessions. */
export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}
