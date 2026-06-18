// SecureVault Crypto Engine
// All encryption/decryption happens CLIENT-SIDE in the browser using the Web Crypto API.
// Nothing is ever sent to a server in plaintext. The server (GitHub Pages) only stores
// ciphertext blobs — it has zero knowledge of the content.

const ALGO = { name: 'AES-GCM', length: 256 }
const PBKDF2_ITERATIONS = 600000  // OWASP 2023 recommendation

// Derive a CryptoKey from a passphrase using PBKDF2
export async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial, ALGO, false, ['encrypt', 'decrypt']
  )
}

// Encrypt a Uint8Array with a passphrase
// Returns: base64(salt + iv + ciphertext)
export async function encryptBytes(data, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(32))
  const iv   = crypto.getRandomValues(new Uint8Array(12))
  const key  = await deriveKey(passphrase, salt)
  const ct   = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  const out  = new Uint8Array(32 + 12 + ct.byteLength)
  out.set(salt, 0)
  out.set(iv, 32)
  out.set(new Uint8Array(ct), 44)
  return btoa(String.fromCharCode(...out))
}

// Decrypt a base64 blob with a passphrase
export async function decryptBytes(b64, passphrase) {
  const raw  = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const salt = raw.slice(0, 32)
  const iv   = raw.slice(32, 44)
  const ct   = raw.slice(44)
  const key  = await deriveKey(passphrase, salt)
  const pt   = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return new Uint8Array(pt)
}

// Encrypt a UTF-8 string
export async function encryptText(text, passphrase) {
  const enc = new TextEncoder()
  return encryptBytes(enc.encode(text), passphrase)
}

// Decrypt to UTF-8 string
export async function decryptText(b64, passphrase) {
  const bytes = await decryptBytes(b64, passphrase)
  return new TextDecoder().decode(bytes)
}

// Read a File as Uint8Array
export function readFileBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(new Uint8Array(e.target.result))
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

// Format file size
export function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1073741824).toFixed(2) + ' GB'
}

// Generate a random session ID
export function randomId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

// Store encrypted payload in localStorage (simulates the vault)
export function vaultStore(id, payload) {
  try {
    const vaults = JSON.parse(localStorage.getItem('sv_vaults') || '{}')
    vaults[id] = { ...payload, ts: Date.now() }
    localStorage.setItem('sv_vaults', JSON.stringify(vaults))
    return true
  } catch { return false }
}

export function vaultGet(id) {
  try {
    const vaults = JSON.parse(localStorage.getItem('sv_vaults') || '{}')
    return vaults[id] || null
  } catch { return null }
}

export function vaultList() {
  try {
    return JSON.parse(localStorage.getItem('sv_vaults') || '{}')
  } catch { return {} }
}

export function vaultDelete(id) {
  try {
    const vaults = JSON.parse(localStorage.getItem('sv_vaults') || '{}')
    delete vaults[id]
    localStorage.setItem('sv_vaults', JSON.stringify(vaults))
    return true
  } catch { return false }
}
