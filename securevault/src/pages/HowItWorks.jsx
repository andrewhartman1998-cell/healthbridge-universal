import { useNavigate } from 'react-router-dom'

export default function HowItWorks() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <span className="font-black text-vault-400">SecureVault</span>
        </button>
        <div className="flex gap-2">
          <button onClick={() => nav('/inbox')} className="text-sm border border-vault-700 text-vault-400 hover:bg-vault-900 px-4 py-2 rounded-lg transition-all">Open Inbox</button>
          <button onClick={() => nav('/send')} className="text-sm bg-vault-600 hover:bg-vault-500 text-white font-bold px-4 py-2 rounded-lg transition-all">Send Securely →</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-white mb-2">How SecureVault Works</h1>
        <p className="text-slate-400 mb-12 text-lg">A plain-English guide to the encryption technology protecting your files and messages.</p>

        {/* The core promise */}
        <div className="bg-vault-900/20 border border-vault-700 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-black text-vault-300 mb-3">The Core Promise</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            When you send a file or message through SecureVault, it is encrypted on your device — in your browser — <strong className="text-white">before it goes anywhere.</strong> The server that stores it cannot read it. We cannot read it. Nobody can read it without the passphrase.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This is fundamentally different from email, where your provider (Gmail, Outlook, Yahoo) can and does read the contents of every message and attachment. SecureVault is <strong className="text-white">zero-knowledge</strong> — we have zero knowledge of what you're sending.
          </p>
        </div>

        {/* Step by step */}
        <h2 className="text-2xl font-black text-white mb-6">Step by Step — What Actually Happens</h2>
        <div className="space-y-4 mb-12">
          {[
            { n:'1', title:'You choose a passphrase', body:'You pick a passphrase and share it with your recipient out-of-band — by phone, in person, or text message. This passphrase never touches the internet. It stays in your browser\'s memory for the duration of your session only.' },
            { n:'2', title:'PBKDF2 key derivation (600,000 iterations)', body:'Your passphrase alone isn\'t used directly as an encryption key — that would be insecure. Instead, it\'s fed through PBKDF2 (Password-Based Key Derivation Function 2) with 600,000 iterations and a random 32-byte salt. This makes brute-force attacks computationally infeasible even with fast hardware. The output is a 256-bit AES-GCM key.' },
            { n:'3', title:'AES-256-GCM encryption — in your browser', body:'Your message text and each file\'s raw bytes are encrypted using AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode). GCM is an authenticated encryption mode — it\'s fast, it\'s secure, and it detects any tampering with the ciphertext. A unique random 12-byte IV (Initialization Vector) is generated for every encryption operation.' },
            { n:'4', title:'Only ciphertext is stored', body:'The encrypted blob (salt + IV + ciphertext) is stored in the browser\'s localStorage. The server (GitHub Pages) only ever sees this ciphertext — unreadable binary data. Your passphrase, your original files, and your message text are never stored anywhere. They exist only in memory during the encryption operation.' },
            { n:'5', title:'The recipient decrypts — in their browser', body:'When the recipient opens the Inbox and enters the passphrase, the same PBKDF2 derivation recreates the AES-256-GCM key. The ciphertext is decrypted locally. If the passphrase is wrong, decryption fails — there\'s no backdoor, no password reset, no master key.' },
            { n:'6', title:'Files are downloaded as decrypted originals', body:'Once decrypted in memory, each file is offered as a browser download. The decrypted bytes exist only momentarily in memory and are never stored to disk by SecureVault. The file you download is exactly the original file the sender attached.' },
          ].map(s => (
            <div key={s.n} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 bg-vault-800 text-vault-300 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5">{s.n}</div>
              <div>
                <h3 className="font-black text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech specs */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-black text-white mb-4">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label:'Encryption algorithm', value:'AES-256-GCM' },
              { label:'Key size', value:'256 bits' },
              { label:'IV size', value:'96 bits (12 bytes, random per operation)' },
              { label:'Authentication tag', value:'128 bits (GCM built-in)' },
              { label:'KDF', value:'PBKDF2-SHA-256' },
              { label:'KDF iterations', value:'600,000 (OWASP 2023 recommended)' },
              { label:'Salt size', value:'256 bits (32 bytes, random per vault)' },
              { label:'Crypto API', value:'Web Crypto API (browser-native, FIPS-validated)' },
              { label:'Server knowledge', value:'Zero — only stores ciphertext blobs' },
              { label:'Passphrase transmitted', value:'Never — stays in browser memory only' },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-2">
                <span className="text-vault-500 text-xs mt-1 flex-shrink-0">▸</span>
                <div>
                  <span className="text-slate-500 text-xs">{r.label}: </span>
                  <span className="text-vault-300 text-xs font-bold">{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What SecureVault is NOT */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-black text-white mb-4">What SecureVault is NOT (important)</h2>
          <div className="space-y-3 text-sm text-slate-400">
            <p>⚠️ <strong className="text-white">Not a replacement for a lawyer.</strong> SecureVault encrypts the content. It does not create a legally certified chain of custody or audit trail.</p>
            <p>⚠️ <strong className="text-white">Not independently audited (yet).</strong> While we use well-established, peer-reviewed cryptographic algorithms (AES-256-GCM, PBKDF2-SHA-256), the implementation has not been independently security-audited. Use appropriate judgment for highly sensitive data.</p>
            <p>⚠️ <strong className="text-white">Passphrase loss = data loss.</strong> There is no password reset. If you lose the passphrase, the encrypted data cannot be recovered by anyone. This is the cost of true zero-knowledge encryption.</p>
            <p>⚠️ <strong className="text-white">Browser storage limits apply.</strong> Large files (multiple GB) may exceed localStorage limits. For very large transfers, split files into multiple vaults.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button onClick={() => nav('/send')} className="bg-vault-600 hover:bg-vault-500 text-white font-black px-10 py-4 rounded-xl text-lg transition-all mr-4">Send Files Securely →</button>
          <button onClick={() => nav('/inbox')} className="border border-dark-700 text-slate-400 hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">Open Inbox</button>
        </div>
      </div>
    </div>
  )
}
