import { useNavigate } from 'react-router-dom'

export default function HowItWorks() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span className="text-xl">✉️</span>
          <span className="font-black text-mail-400">SecureMail</span>
        </button>
        <div className="flex gap-2">
          <button onClick={() => nav('/inbox')} className="text-sm border border-mail-700 text-mail-400 hover:bg-mail-900 px-4 py-2 rounded-lg transition-all">Inbox</button>
          <button onClick={() => nav('/send')} className="text-sm bg-mail-600 hover:bg-mail-500 text-white font-bold px-4 py-2 rounded-lg transition-all">Compose →</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">How SecureMail Works</h1>
          <p className="text-slate-400 text-lg">A plain-English guide to the cryptographic security stack protecting your files and messages.</p>
        </div>

        {/* Core promise */}
        <div className="bg-mail-900/20 border border-mail-700 rounded-2xl p-6">
          <h2 className="text-xl font-black text-mail-300 mb-3">The Core Promise</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            When you send a file or message through SecureMail, it is encrypted on your device — in your browser — <strong className="text-white">before it goes anywhere.</strong> The server cannot read it. We cannot read it. Nobody can read it without the passphrase.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This is fundamentally different from email, where your provider (Gmail, Outlook, Yahoo) can and does access the contents of every message and attachment. SecureMail is <strong className="text-white">zero-knowledge</strong> — we have zero knowledge of what you're sending.
          </p>
        </div>

        {/* Security stack */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">The Full Security Stack</h2>
          <div className="space-y-4">
            {[
              {
                n: '1', icon: '🔑',
                title: 'PBKDF2 Key Derivation (600,000 iterations)',
                body: `Your passphrase alone isn't used as an encryption key — that would be insecure. Instead, it's fed through PBKDF2 (Password-Based Key Derivation Function 2) with 600,000 iterations, a random 32-byte salt, and SHA-256 hashing. This makes brute-force attacks computationally infeasible even with a GPU farm. The OWASP 2023 recommendation is 600,000 iterations — we meet it exactly.`
              },
              {
                n: '2', icon: '🔗',
                title: 'HKDF Key Separation (per-purpose isolated keys)',
                body: `The master key material is never used directly. Instead, HKDF (HMAC-based Key Derivation Function) derives a unique 256-bit AES key for each cryptographic purpose: one key for message text, a separate key for each file's data, another for filenames, another for file types. This means compromise of one key (theoretically) cannot affect any other. It's called "key separation" — a critical but often-skipped security step.`
              },
              {
                n: '3', icon: '🔐',
                title: 'AES-256-GCM Chunked Encryption (4MB chunks)',
                body: `Files are encrypted in 4MB chunks using AES-256-GCM (Galois/Counter Mode). GCM is authenticated encryption — it simultaneously encrypts and proves integrity. Each chunk gets a fresh 12-byte random IV (Initialization Vector). This streaming approach means a 4GB video file never loads fully into RAM — it encrypts a chunk at a time. Large files, archive files, disk images — all handled without memory overload.`
              },
              {
                n: '4', icon: '✅',
                title: 'SHA-256 File Integrity Hashing',
                body: `Before encryption, every file is SHA-256 hashed. This hash is stored alongside the encrypted data. When you download and decrypt a file, the hash is recomputed and compared. If even a single bit was altered in transit or storage — by corruption, by attack, or by accident — decryption will produce a different hash and you'll know. Bit-for-bit verification, automatically.`
              },
              {
                n: '5', icon: '🔏',
                title: 'HMAC-SHA256 Header Signing',
                body: `The vault's metadata header — including priority, expiry settings, burn-on-open flag, and file count — is signed with HMAC-SHA256 using the passphrase-derived key. If anyone modifies these settings after creation (e.g. removes the burn-on-open flag or extends the expiry), the signature will fail and you'll know the mail was tampered with. Standard email has zero equivalent protection.`
              },
              {
                n: '6', icon: '📬',
                title: 'Multi-Recipient Key Envelopes',
                body: `When you add additional recipients, SecureMail creates a key envelope for each one. Your primary passphrase is wrapped (encrypted) under each recipient's passphrase, so they can independently decrypt the same mail without knowing your passphrase. Each envelope is independently protected — recipient A's passphrase can't be used to derive recipient B's. This is cryptographically equivalent to how PGP multi-recipient encryption works, implemented in-browser.`
              },
              {
                n: '7', icon: '🗄️',
                title: 'IndexedDB Storage (GB-scale)',
                body: `All encrypted data is stored in IndexedDB — the browser's structured storage database, not localStorage. localStorage has a ~5MB hard cap. IndexedDB supports gigabytes, limited only by available device storage (which the quota display reflects). This is why SecureMail can handle a 2GB video file: the encrypted chunks are streamed into IndexedDB one at a time, never occupying more than ~8MB of RAM simultaneously.`
              },
              {
                n: '8', icon: '🔥',
                title: 'Burn on Open & Auto-Expiry',
                body: `Burn-on-open deletes the mail permanently from IndexedDB immediately after first decryption — before the decrypted content is even shown. Auto-expiry mails are checked on every inbox load and silently removed if their TTL has elapsed. Neither feature relies on server-side enforcement — it's entirely local, meaning it works offline and can't be bypassed by the server.`
              },
              {
                n: '9', icon: '📍',
                title: 'Per-File Forward Secrecy',
                body: `Each file in a vault is encrypted with its own randomly generated 32-byte ephemeral salt. This means even if you somehow recovered the key material for one file, it provides zero information about the key material for any other file in the same vault. This property — called forward secrecy — is normally only seen in TLS-grade protocols. SecureMail applies it at the file level.`
              },
            ].map(step => (
              <div key={step.n} className="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-mail-900/60 border border-mail-700 rounded-full flex items-center justify-center font-black text-mail-300">{step.n}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-black text-white">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What the server sees */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-4">What the server actually stores</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">What's stored</p>
              <ul className="space-y-1.5 text-sm text-slate-400">
                {[
                  'Ciphertext blobs (random-looking bytes)',
                  'Encrypted file chunk arrays',
                  'Base64-encoded salts and IVs',
                  'HMAC signature of vault header',
                  'Encrypted metadata (label, priority)',
                  'Expiry timestamp (plaintext integer)',
                ].map(i => <li key={i} className="flex items-start gap-2"><span className="text-slate-600 flex-shrink-0">•</span>{i}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">What's never stored</p>
              <ul className="space-y-1.5 text-sm text-slate-400">
                {[
                  'Your passphrase — ever',
                  'Any derived cryptographic key',
                  'Original file bytes',
                  'Filenames (encrypted)',
                  'Message text (encrypted)',
                  'Sender or recipient identities',
                ].map(i => <li key={i} className="flex items-start gap-2"><span className="text-red-600 flex-shrink-0">✕</span>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Threat model */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-4">Threat model</h2>
          <div className="space-y-3 text-sm">
            {[
              { threat: 'Server is compromised', result: '✅ Attacker gets only ciphertext. Without your passphrase, it is computationally indistinguishable from random noise.' },
              { threat: 'Network traffic is intercepted', result: '✅ All data is encrypted before transmission. Intercepted traffic is ciphertext.' },
              { threat: 'Vault metadata is tampered with', result: '✅ HMAC-SHA256 signature will fail — tampering is detected before decryption.' },
              { threat: 'One file key is somehow recovered', result: '✅ Per-file ephemeral salts mean every file uses an independent key. No cross-file compromise.' },
              { threat: 'Passphrase is brute-forced', result: '⚠️ PBKDF2 600k iterations makes this computationally expensive — but a weak passphrase is still a risk. Use a strong passphrase.' },
              { threat: 'Device is physically stolen', result: '⚠️ IndexedDB data is on-device. If the device is unlocked and accessible, the data is accessible. Burn-on-open mails mitigate this.' },
              { threat: 'Browser is compromised by malware', result: '⚠️ A malicious browser extension with full-page access could intercept the passphrase before encryption. Verify your browser environment.' },
            ].map(t => (
              <div key={t.threat} className="flex gap-3 bg-dark-800 rounded-xl p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-xs mb-0.5">{t.threat}</p>
                  <p className="text-slate-400 text-xs">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <button onClick={() => nav('/send')}
            className="bg-mail-600 hover:bg-mail-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all">
            Compose Secure Mail →
          </button>
        </div>
      </div>
    </div>
  )
}
