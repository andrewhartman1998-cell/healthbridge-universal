import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  encryptText, encryptFileChunked, signHeader,
  sha256File, findDuplicateFile,
  fmtSize, fmtSpeed, vaultSave, vaultGetStorageStats, randomId
} from '../crypto'

const STEPS = ['Passphrase', 'Compose', 'Files', 'Recipients', 'Options', 'Send']

const LABELS = ['None','Confidential','Urgent','Legal','Medical','Financial','Personal','FYI']
const LABEL_COLORS = {
  None: 'border-dark-600 text-slate-500',
  Confidential: 'border-red-700 text-red-400 bg-red-900/20',
  Urgent:       'border-orange-600 text-orange-400 bg-orange-900/20',
  Legal:        'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  Medical:      'border-blue-700 text-blue-400 bg-blue-900/20',
  Financial:    'border-green-700 text-green-400 bg-green-900/20',
  Personal:     'border-purple-700 text-purple-400 bg-purple-900/20',
  FYI:          'border-slate-600 text-slate-400',
}
const PRIORITIES = ['Normal','High','Critical']
const PRIORITY_COLORS = { Normal:'text-slate-400', High:'text-orange-400', Critical:'text-red-400' }

function fileIcon(name, mime) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const m = (mime||'').toLowerCase()
  if (m.startsWith('image/') || ['jpg','jpeg','png','gif','webp','svg','bmp','heic','avif'].includes(ext)) return '🖼️'
  if (m.startsWith('video/') || ['mp4','mov','avi','mkv','webm','m4v'].includes(ext)) return '🎬'
  if (m.startsWith('audio/') || ['mp3','wav','flac','aac','ogg','m4a'].includes(ext)) return '🎵'
  if (m === 'application/pdf' || ext === 'pdf') return '📕'
  if (m.includes('word') || ['doc','docx'].includes(ext)) return '📝'
  if (m.includes('excel') || m.includes('spreadsheet') || ['xls','xlsx','csv'].includes(ext)) return '📊'
  if (m.includes('presentation') || ['ppt','pptx'].includes(ext)) return '📊'
  if (m.includes('zip') || ['zip','rar','7z','tar','gz'].includes(ext)) return '🗜️'
  if (['js','ts','jsx','tsx','py','java','cpp','c','go','rs','rb','php','swift'].includes(ext)) return '💻'
  if (['html','css','json','xml','yaml','yml'].includes(ext)) return '🌐'
  if (['key','pem','crt','p12','pfx'].includes(ext)) return '🔑'
  if (['exe','dmg','apk','ipa','pkg'].includes(ext)) return '⚙️'
  return '📦'
}

function PassStrength({ pass }) {
  if (!pass) return null
  let score = 0
  if (pass.length >= 12) score++
  if (pass.length >= 20) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  const labels = ['Very Weak','Weak','Fair','Strong','Very Strong']
  const bars   = ['bg-red-500','bg-orange-500','bg-yellow-500','bg-green-500','bg-emerald-500']
  const texts  = ['text-red-400','text-orange-400','text-yellow-400','text-green-400','text-emerald-400']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3,4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= score ? bars[score] : 'bg-dark-700'}`}/>
        ))}
      </div>
      <p className={`text-xs ${texts[score]}`}>{labels[score]} passphrase</p>
    </div>
  )
}

export default function Send() {
  const nav = useNavigate()
  const fileRef = useRef()

  // Step state
  const [step, setStep] = useState(0)

  // Step 0 — passphrase
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPass, setShowPass]     = useState(false)

  // Step 1 — compose
  const [senderName, setSenderName] = useState('')
  const [subject, setSubject]       = useState('')
  const [message, setMessage]       = useState('')

  // Step 2 — files
  const [files, setFiles]           = useState([])
  const [dragOver, setDragOver]     = useState(false)
  const [hashProgress, setHashProgress] = useState({}) // id → 0..1
  const [dupes, setDupes]           = useState({}) // id → duplicate file record | 'unique'
  const [storageStats, setStorageStats] = useState(null)

  // Step 3 — additional recipients
  const [recipients, setRecipients] = useState([]) // [{passphrase, hint}]
  const [rPass, setRPass]           = useState('')
  const [rHint, setRHint]           = useState('')

  // Step 4 — options
  const [label, setLabel]           = useState('None')
  const [priority, setPriority]     = useState('Normal')
  const [expireDays, setExpireDays] = useState(0)
  const [burnOnOpen, setBurnOnOpen] = useState(false)
  const [tags, setTags]             = useState('')

  // Step 5 — sending
  const [encrypting, setEncrypting]   = useState(false)
  const [statusLine, setStatusLine]   = useState('')
  const [fileProgress, setFileProgress] = useState({}) // id → 0..1
  const [overallPct, setOverallPct]   = useState(0)
  const [encSpeed, setEncSpeed]       = useState(null)
  const [done, setDone]               = useState(null)

  const totalSize = files.reduce((a, f) => a + f.file.size, 0)

  // ── File management ──────────────────────────────────────────────────────
  const addFiles = useCallback(async (incoming) => {
    const newEntries = incoming.map(f => ({
      file: f,
      id: randomId(),
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    }))
    setFiles(prev => [...prev, ...newEntries])

    // Hash each file for deduplication (async, non-blocking)
    for (const entry of newEntries) {
      setHashProgress(p => ({ ...p, [entry.id]: 0 }))
      sha256File(entry.file, (pct) => {
        setHashProgress(p => ({ ...p, [entry.id]: pct }))
      }).then(async hash => {
        const dupe = await findDuplicateFile(hash)
        setDupes(d => ({ ...d, [entry.id]: dupe || 'unique' }))
        setHashProgress(p => { const n = {...p}; delete n[entry.id]; return n })
        // Attach hash to entry
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, sha256: hash } : f))
      })
    }
  }, [])

  const handleInput  = (e) => addFiles(Array.from(e.target.files || []))
  const removeFile   = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  // Load storage stats when reaching step 2
  useEffect(() => {
    if (step === 2) vaultGetStorageStats().then(setStorageStats)
  }, [step])

  // ── Recipients ───────────────────────────────────────────────────────────
  const addRecipient = () => {
    if (!rPass.trim()) return
    setRecipients(r => [...r, { passphrase: rPass.trim(), hint: rHint.trim() }])
    setRPass(''); setRHint('')
  }
  const removeRecipient = (i) => setRecipients(r => r.filter((_,idx) => idx !== i))

  // ── Encrypt & send ───────────────────────────────────────────────────────
  const sendIt = async () => {
    if (!passphrase) return
    setEncrypting(true)
    setOverallPct(0)
    setEncSpeed(null)
    const startTime = Date.now()
    let bytesEncrypted = 0

    try {
      const id = randomId()
      setStatusLine('🔑 Deriving encryption keys…')

      const encMsg     = message    ? await encryptText(message,    passphrase) : null
      const encSender  = senderName ? await encryptText(senderName, passphrase) : null
      const encSubject = subject    ? await encryptText(subject,    passphrase) : null

      const encFileMetas = []
      for (let i = 0; i < files.length; i++) {
        const { file, id: fid, sha256 } = files[i]
        setStatusLine(`🔐 Encrypting ${i+1}/${files.length}: ${file.name}`)
        setFileProgress(p => ({ ...p, [fid]: 0 }))

        const { salt, chunks } = await encryptFileChunked(file, passphrase, (pct) => {
          setFileProgress(p => ({ ...p, [fid]: pct }))
          const done = (i + pct) / files.length
          setOverallPct(done * 90)
          bytesEncrypted = done * totalSize
          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed > 0.5) setEncSpeed(bytesEncrypted / elapsed)
        })

        const encName = await encryptText(file.name, passphrase)
        const encType = await encryptText(file.type || 'application/octet-stream', passphrase)
        encFileMetas.push({ encName, encType, sha256: sha256 || null, salt, chunks, size: file.size, index: i })
        setFileProgress(p => ({ ...p, [fid]: 1 }))
      }

      // Sign vault header (integrity protection)
      setStatusLine('🔏 Signing vault header…')
      const headerSalt = crypto.getRandomValues(new Uint8Array(32))
      const headerObj  = { id, fileCount: files.length, totalSize, ts: Date.now(), label, priority, expireAfterDays: expireDays, burnOnOpen }
      const headerSig  = await signHeader(headerObj, passphrase, headerSalt)
      const headerSaltB64 = btoa(String.fromCharCode(...headerSalt))

      // Multi-recipient envelopes
      setStatusLine('📬 Wrapping recipient keys…')
      const envelopes = []
      for (const r of recipients) {
        const envSalt  = crypto.getRandomValues(new Uint8Array(32))
        // Encrypt primary passphrase under recipient's passphrase
        const encPrimary = await encryptText(passphrase, r.passphrase)
        envelopes.push({ encPrimary, hint: r.hint })
      }

      setStatusLine('💾 Saving encrypted vault…')
      setOverallPct(95)

      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)

      await vaultSave(
        {
          id, encMsg, encSender, encSubject,
          fileCount: files.length, totalSize,
          ts: Date.now(), label, priority,
          expireAfterDays: expireDays, burnOnOpen,
          tags: tagList,
          headerSig, headerSalt: headerSaltB64,
          envelopes, version: 3
        },
        encFileMetas
      )

      setOverallPct(100)
      setDone(id)
    } catch (err) {
      setStatusLine('❌ Error: ' + err.message)
      setEncrypting(false)
    }
  }

  const reset = () => {
    setDone(null); setStep(0)
    setPassphrase(''); setConfirm(''); setMessage(''); setFiles([])
    setSenderName(''); setSubject(''); setLabel('None'); setPriority('Normal')
    setExpireDays(0); setBurnOnOpen(false); setTags('')
    setRecipients([]); setRPass(''); setRHint('')
    setOverallPct(0); setEncrypting(false); setFileProgress({}); setHashProgress({})
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-dark-900 border border-mail-700 rounded-3xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-mail-900/40 border-2 border-mail-600 flex items-center justify-center text-4xl mx-auto mb-5">✉️</div>
        <h2 className="text-2xl font-black text-white mb-1">SecureMail Sent</h2>
        <p className="text-slate-400 text-sm mb-5">
          AES-256-GCM encrypted · HKDF key separation · SHA-256 integrity · Header signed
          {recipients.length > 0 && ` · ${recipients.length + 1} recipients`}
        </p>
        {(label !== 'None' || priority !== 'Normal') && (
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {label !== 'None' && <span className={`text-xs font-bold px-3 py-1 rounded-full border ${LABEL_COLORS[label]}`}>{label}</span>}
            {priority !== 'Normal' && <span className={`text-xs font-bold px-3 py-1 rounded-full border border-current ${PRIORITY_COLORS[priority]}`}>{priority}</span>}
          </div>
        )}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 mb-4 text-left">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Mail ID</p>
          <p className="font-mono text-mail-300 text-sm break-all">{done}</p>
        </div>
        {recipients.length > 0 && (
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-3 mb-4 text-left">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Recipients ({recipients.length + 1} total)</p>
            <p className="text-slate-400 text-xs">• Primary passphrase holder</p>
            {recipients.map((r, i) => (
              <p key={i} className="text-slate-400 text-xs">• {r.hint || `Recipient ${i+1}`}</p>
            ))}
          </div>
        )}
        {burnOnOpen && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 mb-4 text-left">
            <p className="text-red-400 text-xs font-bold">🔥 Burn-on-open enabled — self-deletes after first decryption</p>
          </div>
        )}
        {expireDays > 0 && (
          <div className="bg-orange-900/20 border border-orange-800 rounded-xl p-3 mb-4 text-left">
            <p className="text-orange-400 text-xs font-bold">⏳ Auto-expires in {expireDays} day{expireDays !== 1 ? 's' : ''}</p>
          </div>
        )}
        <div className="bg-mail-900/20 border border-mail-800 rounded-xl p-3 mb-5 text-left">
          <p className="text-mail-300 text-xs font-bold">🔑 Tell your recipient:</p>
          <p className="text-slate-400 text-xs mt-1">SecureMail → Inbox → enter the shared passphrase</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nav('/inbox')} className="bg-mail-600 hover:bg-mail-500 text-white font-black py-3 rounded-xl">Open Inbox</button>
          <button onClick={reset} className="border border-dark-700 text-slate-400 hover:text-white font-bold py-3 rounded-xl">Compose Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span className="text-xl">✉️</span>
          <span className="font-black text-mail-400">SecureMail</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 hidden sm:block">AES-256-GCM · HKDF · SHA-256 · IndexedDB</span>
          <button onClick={() => nav('/inbox')} className="text-sm border border-mail-700 text-mail-400 hover:bg-mail-900 px-4 py-2 rounded-lg transition-all">Inbox</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-1">Compose Secure Mail</h1>
        <p className="text-slate-500 text-sm mb-6">End-to-end encrypted · Unlimited file sizes · GB-scale storage · Multi-recipient</p>

        {/* Step bar */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                  ${i < step ? 'bg-mail-600 text-white' : i === step ? 'bg-mail-500 text-white ring-2 ring-mail-400/30' : 'bg-dark-800 text-slate-600'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-0.5 font-medium hidden sm:block ${i === step ? 'text-mail-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 mb-3 ${i < step ? 'bg-mail-700' : 'bg-dark-800'}`}/>}
            </div>
          ))}
        </div>

        {/* ── Step 0: Passphrase ────────────────────────────────────────── */}
        {step === 0 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-black text-xl text-white mb-1">🔑 Encryption Passphrase</h2>
              <p className="text-slate-400 text-sm">Derives AES-256-GCM key via PBKDF2 (600k iterations). Never transmitted. Share with recipients out-of-band.</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Passphrase</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder="Choose a strong passphrase…"
                  autoComplete="new-password"
                  className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600 pr-14"/>
                <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">{showPass ? 'Hide' : 'Show'}</button>
              </div>
              <PassStrength pass={passphrase} />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Confirm</label>
              <input type={showPass ? 'text' : 'password'} value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter passphrase…"
                autoComplete="new-password"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600"/>
              {confirm && passphrase !== confirm && <p className="text-red-400 text-xs mt-1">⚠️ Passphrases don't match</p>}
            </div>
            <div className="bg-dark-800 border border-mail-900/50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
              <p className="text-mail-400 font-bold">🛡️ Security stack</p>
              <p>PBKDF2 (600k SHA-256 iterations) → HKDF key separation per purpose → AES-256-GCM with unique IVs → SHA-256 file integrity → HMAC-SHA256 header signing → IndexedDB local storage</p>
            </div>
            <button disabled={!passphrase || passphrase !== confirm} onClick={() => setStep(1)}
              className="w-full bg-mail-600 hover:bg-mail-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
              Next: Compose →
            </button>
          </div>
        )}

        {/* ── Step 1: Compose ──────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-black text-xl text-white mb-1">✍️ Compose</h2>
              <p className="text-slate-400 text-sm">All fields encrypted with HKDF-separated keys. Subject is encrypted — only visible after passphrase entry.</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">From (your name, optional)</label>
              <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600"/>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Subject (optional)</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Q3 Legal Documents — Confidential"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600"/>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Message (optional)</label>
              <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Write your encrypted message…"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600 resize-none"/>
              <p className="text-xs text-slate-600 mt-1 text-right">{message.length} chars</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
              <button onClick={() => setStep(2)} className="flex-1 bg-mail-600 hover:bg-mail-500 text-white font-black py-3 rounded-xl transition-all">Next: Attach Files →</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Files ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-black text-xl text-white mb-1">📁 Attach Files</h2>
              <p className="text-slate-400 text-sm">Any file type. Any size. Unlimited. 4MB chunk encryption — streams without loading full file into RAM. SHA-256 deduplication runs automatically.</p>
            </div>

            {storageStats?.quota > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-bold">Device Storage Available</span>
                  <span className="text-slate-500">{fmtSize(storageStats.quota - storageStats.used)} free</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-1.5">
                  <div className="bg-mail-500 h-1.5 rounded-full" style={{width:`${Math.min(100,(storageStats.used/storageStats.quota)*100)}%`}}/>
                </div>
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                ${dragOver ? 'border-mail-400 bg-mail-900/20 scale-[1.01]' : 'border-dark-700 hover:border-mail-600'}`}>
              <div className="text-4xl mb-2">{dragOver ? '⬇️' : '📂'}</div>
              <p className="text-slate-300 font-bold">{dragOver ? 'Drop to add' : 'Drop files or click to browse'}</p>
              <p className="text-slate-600 text-xs mt-1">Images · Video · Audio · PDFs · Code · Archives · Any format · Any size</p>
              <input ref={fileRef} type="file" multiple accept="*/*" onChange={handleInput} className="hidden"/>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map(f => {
                  const hp  = hashProgress[f.id]
                  const dup = dupes[f.id]
                  const isDupe = dup && dup !== 'unique'
                  return (
                    <div key={f.id} className={`flex items-center gap-3 bg-dark-800 border rounded-xl px-3 py-2.5 transition-all
                      ${isDupe ? 'border-yellow-800 bg-yellow-900/10' : 'border-dark-700'}`}>
                      {f.preview
                        ? <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/>
                        : <span className="text-2xl flex-shrink-0 w-10 text-center">{fileIcon(f.file.name, f.file.type)}</span>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{f.file.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-500 text-xs">{fmtSize(f.file.size)}</p>
                          {hp !== undefined && (
                            <span className="text-xs text-slate-600">· hashing…</span>
                          )}
                          {isDupe && <span className="text-xs text-yellow-500 font-bold">⚠️ Duplicate detected</span>}
                          {dup === 'unique' && f.sha256 && <span className="text-xs text-mail-600">✓ SHA-256 verified</span>}
                        </div>
                        {hp !== undefined && (
                          <div className="mt-1 w-full bg-dark-700 rounded-full h-0.5">
                            <div className="bg-mail-700 h-0.5 rounded-full" style={{width:`${hp*100}%`}}/>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeFile(f.id)} className="text-slate-600 hover:text-red-400 text-lg flex-shrink-0">✕</button>
                    </div>
                  )
                })}
                <div className="flex justify-between text-xs text-slate-500 px-1">
                  <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
                  <span>{fmtSize(totalSize)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-mail-600 hover:bg-mail-500 text-white font-black py-3 rounded-xl transition-all">Next: Recipients →</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Recipients ───────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-black text-xl text-white mb-1">👥 Additional Recipients</h2>
              <p className="text-slate-400 text-sm">Optional. Each additional recipient gets their own passphrase that decrypts the same mail. Your primary passphrase is the default.</p>
            </div>
            <div className="bg-mail-900/20 border border-mail-800 rounded-xl p-3 text-xs">
              <p className="text-mail-300 font-bold mb-1">🔑 Primary recipient</p>
              <p className="text-slate-400">Uses your main passphrase ({passphrase.length} chars, {passphrase.length >= 12 ? 'strong' : 'set above'})</p>
            </div>

            {recipients.length > 0 && (
              <div className="space-y-2">
                {recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3">
                    <span className="text-slate-400 text-sm flex-1">
                      <span className="font-bold text-white">{r.hint || `Recipient ${i+2}`}</span>
                      <span className="text-slate-600"> · {'•'.repeat(Math.min(r.passphrase.length, 12))}</span>
                    </span>
                    <button onClick={() => removeRecipient(i)} className="text-slate-600 hover:text-red-400">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-white">+ Add recipient</p>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Their Passphrase</label>
                <input type="password" value={rPass} onChange={e => setRPass(e.target.value)}
                  placeholder="Passphrase for this recipient…"
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-mail-500 placeholder-slate-600"/>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Hint / Name (visible in sent confirmation)</label>
                <input type="text" value={rHint} onChange={e => setRHint(e.target.value)}
                  placeholder="e.g. Alice, Legal Team, Client"
                  className="w-full bg-dark-900 border border-dark-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-mail-500 placeholder-slate-600"/>
              </div>
              <button onClick={addRecipient} disabled={!rPass.trim()}
                className="w-full bg-dark-700 hover:bg-dark-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Add Recipient
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-mail-600 hover:bg-mail-500 text-white font-black py-3 rounded-xl transition-all">Next: Options →</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Options ──────────────────────────────────────────── */}
        {step === 4 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-black text-xl text-white mb-1">⚙️ Mail Options</h2>
              <p className="text-slate-400 text-sm">Features that go far beyond standard email. All stored encrypted.</p>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Classification Label</label>
              <div className="flex flex-wrap gap-2">
                {LABELS.map(l => (
                  <button key={l} onClick={() => setLabel(l)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all
                      ${label === l ? LABEL_COLORS[l] + ' ring-1 ring-current' : 'border-dark-700 text-slate-600 hover:border-dark-500'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
              <div className="flex gap-3">
                {PRIORITIES.map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 text-sm font-bold py-2.5 rounded-xl border transition-all
                      ${priority === p ? 'border-current ' + PRIORITY_COLORS[p] + ' bg-dark-800' : 'border-dark-700 text-slate-600 hover:border-dark-500'}`}>
                    {p === 'Normal' ? '⚪' : p === 'High' ? '🟠' : '🔴'} {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Auto-Expire</label>
              <div className="flex flex-wrap gap-2">
                {[0,1,3,7,14,30].map(d => (
                  <button key={d} onClick={() => setExpireDays(d)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all
                      ${expireDays === d ? 'border-orange-600 text-orange-400 bg-orange-900/20' : 'border-dark-700 text-slate-600 hover:border-dark-500'}`}>
                    {d === 0 ? 'Never' : d === 1 ? '24 hours' : `${d} days`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Destruction</label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                ${burnOnOpen ? 'border-red-700 bg-red-900/20' : 'border-dark-700 hover:border-dark-600'}`}>
                <input type="checkbox" checked={burnOnOpen} onChange={e => setBurnOnOpen(e.target.checked)} className="accent-red-500 w-4 h-4"/>
                <div>
                  <p className="text-sm font-bold text-white">🔥 Burn on open</p>
                  <p className="text-xs text-slate-500">Mail self-deletes after first decryption</p>
                </div>
              </label>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Tags (comma-separated, optional)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                placeholder="e.g. contract, Q3, legal, ndp"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600"/>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all">← Back</button>
              <button onClick={() => setStep(5)} className="flex-1 bg-mail-600 hover:bg-mail-500 text-white font-black py-3 rounded-xl transition-all">Review & Send →</button>
            </div>
          </div>
        )}

        {/* ── Step 5: Review & Send ────────────────────────────────────── */}
        {step === 5 && (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-black text-xl text-white">🚀 Review & Encrypt</h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Files</p>
                <p className="text-white font-bold">{files.length} file{files.length !== 1 ? 's' : ''}</p>
                <p className="text-slate-500 text-xs">{fmtSize(totalSize)}</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Recipients</p>
                <p className="text-white font-bold">{recipients.length + 1}</p>
                <p className="text-slate-500 text-xs">multi-key envelope</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Label / Priority</p>
                <p className="text-white font-bold text-xs">{label !== 'None' ? label : '—'} / {priority}</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Expiry / Burn</p>
                <p className="text-white font-bold text-xs">{expireDays === 0 ? 'Never' : expireDays + 'd'} / {burnOnOpen ? '🔥 Yes' : 'No'}</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-2">Files</p>
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-2 text-xs mb-1">
                    <span>{fileIcon(f.file.name, f.file.type)}</span>
                    <span className="text-white truncate flex-1">{f.file.name}</span>
                    <span className="text-slate-500 flex-shrink-0">{fmtSize(f.file.size)}</span>
                    {f.sha256 && <span className="text-mail-700 flex-shrink-0">✓</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Encryption progress */}
            {encrypting && (
              <div className="bg-dark-800 border border-mail-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-mail-300 font-bold truncate">{statusLine}</span>
                  <span className="text-slate-500 flex-shrink-0 ml-2">{Math.round(overallPct)}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div className="bg-mail-500 h-2 rounded-full transition-all duration-200" style={{width:`${overallPct}%`}}/>
                </div>
                {encSpeed && (
                  <p className="text-xs text-slate-600 text-right">{fmtSpeed(encSpeed)}</p>
                )}
                {files.map(f => {
                  const pct = fileProgress[f.id] || 0
                  return (pct > 0 && pct < 1) ? (
                    <div key={f.id}>
                      <p className="text-xs text-slate-600 mb-0.5 truncate">{f.file.name}</p>
                      <div className="w-full bg-dark-700 rounded-full h-1">
                        <div className="bg-mail-700 h-1 rounded-full transition-all" style={{width:`${pct*100}%`}}/>
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            )}

            {statusLine && !encrypting && statusLine.startsWith('❌') && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-3">
                <p className="text-red-400 text-sm">{statusLine}</p>
              </div>
            )}

            <div className="bg-mail-900/20 border border-mail-800 rounded-xl p-3 text-xs text-slate-500">
              <span className="text-mail-400 font-bold">🔐 Security: </span>
              PBKDF2 600k → HKDF key separation → AES-256-GCM per-chunk · SHA-256 per-file · HMAC-SHA256 header · {recipients.length + 1} recipient envelope{recipients.length > 0 ? 's' : ''}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} disabled={encrypting}
                className="flex-1 border border-dark-700 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-all disabled:opacity-40">← Back</button>
              <button onClick={sendIt} disabled={encrypting}
                className="flex-1 bg-mail-600 hover:bg-mail-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
                {encrypting ? '🔐 Encrypting…' : '✉️ Encrypt & Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
