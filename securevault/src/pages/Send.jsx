import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { encryptText, encryptBytes, readFileBytes, fmtSize, vaultStore, randomId } from '../crypto'

const STEPS = ['Passphrase', 'Message', 'Files', 'Send']

export default function Send() {
  const nav = useNavigate()
  const fileRef = useRef()
  const [step, setStep] = useState(0)
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [done, setDone] = useState(null)
  const [encrypting, setEncrypting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const addFiles = (e) => {
    const incoming = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...incoming.map(f => ({ file: f, id: randomId() }))])
  }

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const handleDrop = (e) => {
    e.preventDefault()
    const incoming = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...incoming.map(f => ({ file: f, id: randomId() }))])
  }

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)

  const sendIt = async () => {
    if (!passphrase) return
    setEncrypting(true)
    setStatus('🔐 Encrypting message...')
    try {
      const id = randomId()
      const encMsg = message ? await encryptText(message, passphrase) : null
      const encSender = senderName ? await encryptText(senderName, passphrase) : null
      const encFiles = []
      for (let i = 0; i < files.length; i++) {
        setStatus(`🔐 Encrypting file ${i + 1} of ${files.length}: ${files[i].file.name}`)
        const bytes = await readFileBytes(files[i].file)
        const encData = await encryptBytes(bytes, passphrase)
        const encName = await encryptText(files[i].file.name, passphrase)
        const encType = await encryptText(files[i].file.type || 'application/octet-stream', passphrase)
        encFiles.push({ encData, encName, encType, size: files[i].file.size })
      }
      setStatus('💾 Storing encrypted vault...')
      const ok = vaultStore(id, {
        encMsg,
        encSender,
        encFiles,
        fileCount: files.length,
        totalSize,
        ts: Date.now()
      })
      if (ok) {
        setDone(id)
        setStatus('')
      } else {
        setStatus('❌ Storage failed — files may be too large for browser storage.')
      }
    } catch (err) {
      setStatus('❌ Encryption error: ' + err.message)
    }
    setEncrypting(false)
  }

  if (done) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-dark-900 border border-vault-700 rounded-3xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-white mb-2">Vault Sealed & Delivered</h2>
        <p className="text-slate-400 mb-6">Your files and message have been encrypted and stored. The recipient can open their inbox with the shared passphrase to access them.</p>
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Vault ID (share if needed)</p>
          <p className="font-mono text-vault-300 text-sm break-all">{done}</p>
        </div>
        <div className="bg-vault-900/20 border border-vault-800 rounded-xl p-4 mb-6 text-left">
          <p className="text-vault-300 text-sm font-bold mb-1">🔑 Remind your recipient:</p>
          <p className="text-slate-400 text-sm">They need the <strong className="text-white">same passphrase</strong> you used to open the Inbox and decrypt this vault.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => nav('/inbox')} className="flex-1 bg-vault-600 hover:bg-vault-500 text-white font-black py-3 rounded-xl transition-all">Open Inbox</button>
          <button onClick={() => { setDone(null); setStep(0); setPassphrase(''); setConfirm(''); setMessage(''); setFiles([]); setSenderName('') }}
            className="flex-1 border border-dark-700 text-slate-400 hover:text-white font-bold py-3 rounded-xl transition-all">Send Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Nav */}
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <span className="font-black text-vault-400">SecureVault</span>
        </button>
        <button onClick={() => nav('/inbox')} className="text-sm border border-vault-700 text-vault-400 hover:bg-vault-900 px-4 py-2 rounded-lg transition-all">Open Inbox</button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">Send a Secure Vault</h1>
        <p className="text-slate-400 mb-8">Everything is encrypted in your browser. The server only stores an unreadable ciphertext blob.</p>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-vault-600 text-white' : i === step ? 'bg-vault-500 text-white' : 'bg-dark-800 text-slate-600'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-bold ${i === step ? 'text-vault-400' : 'text-slate-600'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 min-w-6 ${i < step ? 'bg-vault-700' : 'bg-dark-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Passphrase */}
        {step === 0 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h2 className="font-black text-white text-xl mb-2">🔑 Set Encryption Passphrase</h2>
            <p className="text-slate-400 text-sm mb-5">Choose a passphrase and share it with your recipient out-of-band (by phone, text, or in person). This passphrase is <strong className="text-white">never sent to any server</strong>.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-widest">Passphrase</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    placeholder="Choose a strong passphrase..."
                    className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-500 placeholder-slate-600 pr-12"
                  />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">{showPass ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-widest">Confirm Passphrase</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter passphrase..."
                  className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-500 placeholder-slate-600"
                />
              </div>
              {confirm && passphrase !== confirm && <p className="text-red-400 text-xs">⚠️ Passphrases don't match</p>}
              {passphrase.length > 0 && passphrase.length < 8 && <p className="text-yellow-400 text-xs">⚠️ Use at least 8 characters for better security</p>}
              <div className="bg-dark-800 border border-vault-900 rounded-xl p-3">
                <p className="text-vault-400 text-xs font-bold mb-1">🔐 Security Note</p>
                <p className="text-slate-500 text-xs">Your passphrase is used to derive an AES-256-GCM encryption key via PBKDF2 with 600,000 iterations. It never leaves your browser.</p>
              </div>
              <button
                disabled={!passphrase || passphrase !== confirm}
                onClick={() => setStep(1)}
                className="w-full bg-vault-600 hover:bg-vault-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
                Next: Write Message →
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Message */}
        {step === 1 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h2 className="font-black text-white text-xl mb-2">💬 Add an Encrypted Message</h2>
            <p className="text-slate-400 text-sm mb-5">Optional — write a message to the recipient. It will be encrypted along with your files.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-widest">Your Name (optional)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-500 placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-widest">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write your message here — it will be encrypted before it leaves your device..."
                  rows={5}
                  className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-500 placeholder-slate-600 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 bg-vault-600 hover:bg-vault-500 text-white font-black py-3 rounded-xl transition-all">Next: Attach Files →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Files */}
        {step === 2 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h2 className="font-black text-white text-xl mb-2">📁 Attach Files</h2>
            <p className="text-slate-400 text-sm mb-5">Attach as many files as you need — no limits. All encrypted before upload.</p>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-dark-700 hover:border-vault-600 rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 group">
              <div className="text-4xl mb-2">📂</div>
              <p className="text-slate-400 font-bold group-hover:text-vault-300 transition-colors">Drop files here or click to browse</p>
              <p className="text-slate-600 text-xs mt-1">Any file type. No limits. All encrypted.</p>
              <input ref={fileRef} type="file" multiple onChange={addFiles} />
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl flex-shrink-0">📄</span>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate">{f.file.name}</p>
                        <p className="text-slate-500 text-xs">{fmtSize(f.file.size)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(f.id)} className="text-slate-600 hover:text-red-400 text-sm ml-2 flex-shrink-0">✕</button>
                  </div>
                ))}
                <div className="text-right text-slate-500 text-xs">{files.length} file{files.length !== 1 ? 's' : ''} · {fmtSize(totalSize)} total</div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-vault-600 hover:bg-vault-500 text-white font-black py-3 rounded-xl transition-all">
                Review & Send →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Send */}
        {step === 3 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h2 className="font-black text-white text-xl mb-2">🚀 Review & Encrypt</h2>
            <div className="space-y-3 mb-6">
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Passphrase</p>
                <p className="text-vault-300 font-bold">{'•'.repeat(passphrase.length)} (set, never displayed)</p>
              </div>
              {senderName && (
                <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">From</p>
                  <p className="text-white font-bold">{senderName}</p>
                </div>
              )}
              {message && (
                <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Message</p>
                  <p className="text-slate-300 text-sm">{message.slice(0, 120)}{message.length > 120 ? '...' : ''}</p>
                </div>
              )}
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Files</p>
                {files.length === 0
                  ? <p className="text-slate-500 text-sm">No files attached</p>
                  : files.map(f => <p key={f.id} className="text-white text-sm">📄 {f.file.name} ({fmtSize(f.file.size)})</p>)
                }
              </div>
              <div className="bg-vault-900/20 border border-vault-800 rounded-xl p-4">
                <p className="text-vault-300 text-sm font-bold">🔐 What happens when you click Send:</p>
                <ol className="text-slate-400 text-xs mt-2 space-y-1 list-decimal list-inside">
                  <li>Your passphrase derives an AES-256-GCM key via PBKDF2 (600k iterations) — in your browser</li>
                  <li>Message and all file bytes are encrypted with unique IVs — in your browser</li>
                  <li>Only ciphertext is stored — the server sees zero plaintext</li>
                  <li>Your passphrase is discarded from memory — never transmitted</li>
                </ol>
              </div>
            </div>
            {status && (
              <div className="bg-dark-800 border border-vault-800 rounded-xl p-3 mb-4">
                <p className="text-vault-300 text-sm font-bold">{status}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} disabled={encrypting} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all disabled:opacity-50">← Back</button>
              <button onClick={sendIt} disabled={encrypting}
                className="flex-1 bg-vault-600 hover:bg-vault-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
                {encrypting ? '🔐 Encrypting...' : '🔒 Encrypt & Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
