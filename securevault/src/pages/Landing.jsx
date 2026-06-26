import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { emoji: '🔐', title: 'AES-256-GCM Encryption', desc: 'Military-grade authenticated encryption. Files and messages are encrypted in your browser before they leave your device. Zero plaintext ever stored.' },
  { emoji: '🧠', title: 'Zero-Knowledge Architecture', desc: 'The server stores only opaque ciphertext — blobs we cannot read. Your passphrase never leaves your device. No master keys. No backdoors. No exceptions.' },
  { emoji: '🔗', title: 'HKDF Key Separation', desc: 'Distinct AES keys per purpose — filenames, file data, messages, and headers each use a cryptographically isolated key derived via HKDF. Compromise of one cannot affect another.' },
  { emoji: '✅', title: 'SHA-256 File Integrity', desc: 'Every file is SHA-256 hashed before encryption and after decryption. Bit-for-bit verification that your file was never tampered with in transit or storage.' },
  { emoji: '📬', title: 'Multi-Recipient Envelopes', desc: 'Send the same encrypted mail to multiple recipients, each with their own independent passphrase. No key sharing, no coordination required.' },
  { emoji: '🔥', title: 'Burn on Open', desc: 'Enable self-destruction: the mail permanently deletes itself after the first decryption. One view, then gone — no trace on any device.' },
  { emoji: '⏳', title: 'Auto-Expiry', desc: 'Set mails to automatically vanish after 24 hours, 3 days, 7 days, or any custom window. No manual cleanup needed.' },
  { emoji: '📁', title: 'Unlimited File Sizes', desc: 'Chunked 4MB streaming encryption handles files of any size — gigabyte videos, disk images, full datasets — without ever loading them fully into RAM.' },
  { emoji: '🔏', title: 'Signed Headers', desc: 'Every mail header is signed with HMAC-SHA256. If priority, expiry, or burn-on-open settings are tampered with, decryption will detect it.' },
  { emoji: '🗜️', title: 'One-Click ZIP Export', desc: 'Decrypt and download all attachments as a single ZIP file. Every file individually verified before packaging.' },
  { emoji: '👁', title: 'Inline Preview', desc: 'Images, videos, audio, PDFs, and text files preview directly in the browser — no download required. Decrypted locally, never uploaded anywhere.' },
  { emoji: '🆓', title: 'Free. Forever. No Limits.', desc: 'No subscriptions. No freemium. No credit card. No accounts. SecureMail is free for every user, every use, for life.' },
]

const STEPS = [
  { n: '1', title: 'Set a passphrase', desc: 'You choose a passphrase and share it with your recipient out-of-band — by phone, text, or in person. It never touches the internet.' },
  { n: '2', title: 'Compose & attach', desc: 'Write an encrypted message, attach files of any size and type. SHA-256 deduplication runs automatically on every file.' },
  { n: '3', title: 'Set options', desc: 'Choose labels, priority, auto-expiry, burn-on-open, and add additional recipients — each with their own passphrase.' },
  { n: '4', title: 'Recipient opens inbox', desc: 'They enter the passphrase. Everything decrypts locally in their browser. Header signature is verified. Files are integrity-checked.' },
]

const COMPARISON = [
  ['End-to-end encrypted',        '✅ Always, AES-256-GCM',   '❌ Never by default'],
  ['Zero-knowledge server',        '✅ Yes',                   '❌ Provider reads everything'],
  ['No account required',          '✅ Yes',                   '❌ Account + password required'],
  ['Files encrypted before upload','✅ Yes — in browser',      '❌ No'],
  ['File size limit',              '✅ None — GB-scale',       '⚠️ 25MB typical limit'],
  ['Multi-recipient',              '✅ Independent passphrases','⚠️ BCC/forward only'],
  ['Burn on open',                 '✅ Yes',                   '❌ No'],
  ['Auto-expiry',                  '✅ Yes',                   '❌ Sits in inbox forever'],
  ['File integrity verification',  '✅ SHA-256 per file',      '❌ No'],
  ['Header tamper detection',      '✅ HMAC-SHA256 signed',    '❌ No'],
  ['Inline file preview',          '✅ Yes, locally decrypted','⚠️ Some clients only'],
  ['HKDF key separation',          '✅ Per-purpose keys',      '❌ No cryptographic isolation'],
  ['Free forever',                 '✅ Yes',                   '⚠️ Free / paid tiers'],
]

export default function Landing() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Nav */}
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✉️</span>
          <span className="font-black text-xl text-mail-400">SecureMail</span>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => nav('/how-it-works')} className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors hidden sm:block">How It Works</button>
          <button onClick={() => nav('/inbox')} className="text-sm border border-mail-700 text-mail-400 hover:bg-mail-900 px-4 py-2 rounded-lg transition-all">Inbox</button>
          <button onClick={() => nav('/send')} className="text-sm bg-mail-600 hover:bg-mail-500 text-white font-bold px-4 py-2 rounded-lg transition-all">Compose →</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 20% 30%, #16a34a 0%, transparent 50%), radial-gradient(circle at 80% 70%, #15803d 0%, transparent 50%)'}}/>
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-mail-900/40 border border-mail-700 text-mail-300 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            ✉️ AES-256-GCM · HKDF · SHA-256 Integrity · HMAC Signing · Zero-Knowledge
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
            Email reimagined.<br/>
            <span className="text-mail-400">Encrypted end-to-end.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            SecureMail is what email should have always been. Send any file — any size — encrypted in your browser before it leaves your device. Zero server knowledge. Unlimited attachments. Multi-recipient. Free forever.
          </p>
          <p className="text-slate-500 max-w-xl mx-auto mb-10 text-sm">
            PBKDF2 (600k iterations) → HKDF key separation → AES-256-GCM chunked encryption → SHA-256 integrity verification → HMAC-SHA256 header signing. No compromises.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => nav('/send')}
              className="bg-mail-600 hover:bg-mail-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all shadow-2xl shadow-mail-900/50">
              Compose Secure Mail →
            </button>
            <button onClick={() => nav('/inbox')}
              className="border border-slate-700 hover:border-mail-500 text-slate-300 font-bold px-8 py-4 rounded-xl text-lg transition-all">
              Open Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-dark-900 border-y border-dark-800">
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '🔐', label: 'AES-256-GCM' },
            { icon: '🔗', label: 'HKDF Key Separation' },
            { icon: '✅', label: 'SHA-256 Integrity' },
            { icon: '🔏', label: 'HMAC Header Signing' },
          ].map(t => (
            <div key={t.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-slate-400 text-xs font-bold">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-white text-center mb-2">How SecureMail works</h2>
        <p className="text-slate-400 text-center mb-12 text-sm">Four steps. No accounts. No software. Just a browser and a passphrase.</p>
        <div className="grid md:grid-cols-4 gap-5 mb-20">
          {STEPS.map(s => (
            <div key={s.n} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 text-center hover:border-mail-800 transition-all">
              <div className="w-10 h-10 bg-mail-900/60 border border-mail-700 text-mail-300 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3">{s.n}</div>
              <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-3xl font-black text-white text-center mb-2">Why SecureMail</h2>
        <p className="text-slate-400 text-center mb-12 text-sm">Built from the ground up for one purpose: sending sensitive information without trusting anyone.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-dark-900 border border-dark-800 hover:border-mail-700 rounded-2xl p-5 transition-all group">
              <div className="text-2xl mb-3">{f.emoji}</div>
              <h3 className="font-black text-white text-sm mb-1.5 group-hover:text-mail-400 transition-colors">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 md:p-8 mb-20">
          <h2 className="text-2xl font-black text-white mb-6 text-center">SecureMail vs. Email</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 text-slate-400 font-bold">Feature</th>
                  <th className="text-center py-3 text-mail-400 font-black">SecureMail</th>
                  <th className="text-center py-3 text-slate-500 font-bold">Standard Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {COMPARISON.map(([feat, sv, em]) => (
                  <tr key={feat} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-3 text-slate-300 font-medium text-xs md:text-sm">{feat}</td>
                    <td className="py-3 text-center text-mail-300 font-bold text-xs">{sv}</td>
                    <td className="py-3 text-center text-slate-500 text-xs">{em}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-mail-900/30 to-dark-900 border border-mail-800 rounded-3xl p-8 md:p-10 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-3xl font-black text-white mb-3">Ready to send something truly secure?</h2>
          <p className="text-slate-400 mb-8 text-sm">No sign-up. No credit card. No limits. Zero-knowledge. Just encrypted.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => nav('/send')}
              className="bg-mail-600 hover:bg-mail-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all">
              Compose Secure Mail →
            </button>
            <button onClick={() => nav('/how-it-works')}
              className="border border-dark-600 hover:border-mail-600 text-slate-400 hover:text-white font-bold px-8 py-4 rounded-xl transition-all">
              Read the Tech Docs
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-dark-800 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span>✉️</span>
          <span className="font-black text-mail-400">SecureMail</span>
        </div>
        <p className="text-slate-600 text-xs max-w-lg mx-auto">
          Zero-knowledge encrypted mail. AES-256-GCM · PBKDF2 600k · HKDF key separation · SHA-256 integrity · HMAC-SHA256 header signing · IndexedDB local storage. No server ever sees plaintext.
        </p>
      </footer>
    </div>
  )
}
