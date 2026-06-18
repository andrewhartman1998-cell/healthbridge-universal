import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { emoji: '🔐', title: 'AES-256-GCM Encryption', desc: 'Military-grade encryption. Your files and messages are encrypted in your browser before they leave your device. We never see plaintext. Ever.' },
  { emoji: '🧠', title: 'Zero-Knowledge Architecture', desc: 'The server stores only ciphertext — encrypted blobs we cannot read. Your passphrase never leaves your device. No backdoors. No master keys.' },
  { emoji: '📁', title: 'Unlimited Files, No Limits', desc: 'Send as many files as you need. No file count limits. No storage caps imposed by us. Documents, spreadsheets, images — all encrypted.' },
  { emoji: '💬', title: 'Encrypted Messages', desc: 'Write a private message alongside your files. It\'s encrypted with the same AES-256-GCM standard. No one reads your words but the intended recipient.' },
  { emoji: '🔑', title: 'Passphrase-Based Access', desc: 'Decrypt your inbox with your private passphrase. Share a different passphrase with each client for complete isolation. No passwords stored anywhere.' },
  { emoji: '🆓', title: 'Free. Forever. No Exceptions.', desc: 'No subscriptions. No freemium limits. No credit card. SecureVault is free for every user, every use, for life. Built for people who need security, not for profit.' },
]

const STEPS = [
  { n: '1', title: 'Client opens SecureVault', desc: 'No account needed. They go to the Send page.' },
  { n: '2', title: 'They enter your shared passphrase', desc: 'You give each client a passphrase out-of-band (by phone, in person, or text).' },
  { n: '3', title: 'They attach files + write a message', desc: 'Unlimited files. All encrypted client-side before upload.' },
  { n: '4', title: 'You open your Inbox', desc: 'Enter your passphrase. Everything decrypts locally. You download their files.' },
]

export default function Landing() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Nav */}
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <span className="font-black text-xl text-vault-400">SecureVault</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => nav('/how-it-works')} className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors">How It Works</button>
          <button onClick={() => nav('/inbox')} className="text-sm border border-vault-700 text-vault-400 hover:bg-vault-900 px-4 py-2 rounded-lg transition-all">Open Inbox</button>
          <button onClick={() => nav('/send')} className="text-sm bg-vault-600 hover:bg-vault-500 text-white font-bold px-4 py-2 rounded-lg transition-all">Send Securely →</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vault-950/40 via-dark-950 to-dark-950" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 25% 25%, #16a34a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #15803d 0%, transparent 50%)'}} />
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-vault-900/40 border border-vault-700 text-vault-300 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            🔐 AES-256-GCM · Zero-Knowledge · Client-Side Encryption · Free Forever
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-none">
            Email was never<br/>
            <span className="text-vault-400">meant to be secure.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            SecureVault is the encrypted file and message portal that email should have always been. Send sensitive documents, tax records, financial data — all encrypted in your browser before they leave your device.
          </p>
          <p className="text-slate-500 max-w-xl mx-auto mb-10">
            Zero-knowledge. No accounts required. Unlimited files. Free for everyone, forever.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => nav('/send')}
              className="bg-vault-600 hover:bg-vault-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all shadow-2xl shadow-vault-900/50">
              Send Files Securely →
            </button>
            <button onClick={() => nav('/inbox')}
              className="border border-slate-600 hover:border-vault-500 text-slate-300 font-bold px-8 py-4 rounded-xl text-lg transition-all">
              Open My Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-dark-900 border-y border-dark-800">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🔒', label: 'AES-256-GCM Encryption' },
            { icon: '🧠', label: 'Zero-Knowledge Server' },
            { icon: '📁', label: 'Unlimited Files' },
            { icon: '🆓', label: 'Free Forever' },
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
        <h2 className="text-3xl font-black text-white text-center mb-3">How it works</h2>
        <p className="text-slate-400 text-center mb-12">Four steps. No accounts. No software. Just a browser.</p>
        <div className="grid md:grid-cols-4 gap-5 mb-20">
          {STEPS.map(s => (
            <div key={s.n} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 bg-vault-800 text-vault-300 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3">{s.n}</div>
              <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-3xl font-black text-white text-center mb-3">Why SecureVault</h2>
        <p className="text-slate-400 text-center mb-12">Built from the ground up for one purpose: sending sensitive information without trusting anyone.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-dark-900 border border-dark-800 hover:border-vault-700 rounded-2xl p-6 transition-all group">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-black text-white text-base mb-2 group-hover:text-vault-400 transition-colors">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Vs email */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 mb-20">
          <h2 className="text-2xl font-black text-white mb-6 text-center">SecureVault vs. Email</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 text-slate-400 font-bold">Feature</th>
                  <th className="text-center py-3 text-vault-400 font-black">SecureVault</th>
                  <th className="text-center py-3 text-slate-500 font-bold">Regular Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {[
                  ['End-to-end encrypted', '✅ Always', '❌ Never by default'],
                  ['Zero-knowledge server', '✅ Yes', '❌ Google/Microsoft read it'],
                  ['No account required', '✅ Yes', '❌ Account required'],
                  ['Files encrypted before upload', '✅ Yes', '❌ No'],
                  ['Passphrase-protected inbox', '✅ Yes', '❌ Password only'],
                  ['Unlimited files', '✅ Yes', '⚠️ Attachment size limits'],
                  ['Cost', '✅ Free forever', '⚠️ Free/paid tiers'],
                  ['HIPAA/sensitive data ready', '✅ Yes (user-managed)', '❌ Not without paid add-ons'],
                ].map(([feat, sv, em]) => (
                  <tr key={feat}>
                    <td className="py-3 text-slate-300 font-medium">{feat}</td>
                    <td className="py-3 text-center text-vault-300 font-bold">{sv}</td>
                    <td className="py-3 text-center text-slate-500">{em}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-vault-900/30 to-dark-900 border border-vault-800 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to send something securely?</h2>
          <p className="text-slate-400 mb-8">No sign-up. No credit card. No limit. Just encrypted.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => nav('/send')}
              className="bg-vault-600 hover:bg-vault-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all">
              Send Files Now →
            </button>
            <button onClick={() => nav('/inbox')}
              className="border border-vault-700 text-vault-300 hover:bg-vault-900 font-bold px-8 py-4 rounded-xl text-lg transition-all">
              Open Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-800 py-8 text-center text-slate-600 text-sm">
        <p>🔒 SecureVault — Encrypted File & Message Portal</p>
        <p className="mt-1">All encryption is performed client-side using the Web Crypto API (AES-256-GCM + PBKDF2). The server never has access to your plaintext data.</p>
        <p className="mt-1">Free forever. Open source. Part of the <a href="https://andrewhartman1998-cell.github.io/healthbridge-universal/" className="text-vault-600 hover:text-vault-400">Andrew Hartman Social Impact Portfolio</a>.</p>
      </div>
    </div>
  )
}
