import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  decryptText, decryptFileChunked, verifyHeader,
  vaultListAll, vaultGetFiles, vaultDeleteById, vaultMarkOpened,
  fmtSize, fmtSpeed, vaultGetStorageStats
} from '../crypto'

// ── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const d = Date.now() - ts
  if (d < 60000)    return 'just now'
  if (d < 3600000)  return Math.floor(d/60000) + 'm ago'
  if (d < 86400000) return Math.floor(d/3600000) + 'h ago'
  return Math.floor(d/86400000) + 'd ago'
}

function fileIcon(name, mime) {
  const ext = (name||'').split('.').pop()?.toLowerCase() || ''
  const m = (mime||'').toLowerCase()
  if (m.startsWith('image/') || ['jpg','jpeg','png','gif','webp','svg','bmp','heic','avif'].includes(ext)) return '🖼️'
  if (m.startsWith('video/') || ['mp4','mov','avi','mkv','webm','m4v'].includes(ext)) return '🎬'
  if (m.startsWith('audio/') || ['mp3','wav','flac','aac','ogg','m4a'].includes(ext)) return '🎵'
  if (m === 'application/pdf' || ext === 'pdf') return '📕'
  if (m.includes('word') || ['doc','docx'].includes(ext)) return '📝'
  if (m.includes('excel') || m.includes('spreadsheet') || ['xls','xlsx','csv'].includes(ext)) return '📊'
  if (m.includes('presentation') || ['ppt','pptx'].includes(ext)) return '📊'
  if (m.includes('zip') || ['zip','rar','7z','tar','gz'].includes(ext)) return '🗜️'
  if (['js','ts','jsx','tsx','py','java','cpp','c','go','rs','php'].includes(ext)) return '💻'
  if (['html','css','json','xml','yaml','yml'].includes(ext)) return '🌐'
  if (['key','pem','crt','p12','pfx'].includes(ext)) return '🔑'
  if (['exe','dmg','apk','ipa'].includes(ext)) return '⚙️'
  return '📦'
}

function isPreviewable(mime) {
  const m = (mime||'').toLowerCase()
  return m.startsWith('image/') || m.startsWith('video/') || m.startsWith('audio/') || m === 'application/pdf' || m.startsWith('text/')
}

const LABEL_COLORS = {
  None: '',
  Confidential: 'text-red-400 border-red-800 bg-red-900/20',
  Urgent: 'text-orange-400 border-orange-700 bg-orange-900/20',
  Legal: 'text-yellow-400 border-yellow-800 bg-yellow-900/20',
  Medical: 'text-blue-400 border-blue-800 bg-blue-900/20',
  Financial: 'text-green-400 border-green-800 bg-green-900/20',
  Personal: 'text-purple-400 border-purple-800 bg-purple-900/20',
  FYI: 'text-slate-400 border-slate-700',
}
const PRIORITY_COLORS = { Normal: 'text-slate-500', High: 'text-orange-400', Critical: 'text-red-400' }
const PRIORITY_ICON   = { Normal: '', High: '🟠', Critical: '🔴' }

// ── Component ──────────────────────────────────────────────────────────────
export default function Inbox() {
  const nav = useNavigate()
  const [passphrase, setPassphrase] = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [unlocked, setUnlocked]     = useState(false)
  const [error, setError]           = useState('')
  const [vaults, setVaults]         = useState({})
  const [decrypted, setDecrypted]   = useState({})   // id → { msg, sender, subject, files: [{name,type,size}] }
  const [decryptingId, setDecryptingId] = useState(null)
  const [selected, setSelected]     = useState(null)
  const [dlStatus, setDlStatus]     = useState({})   // `${id}_${i}` → 'loading'|'done'|'error'
  const [dlProgress, setDlProgress] = useState({})   // `${id}_${i}` → 0..1
  const [previewUrl, setPreviewUrl] = useState(null) // { url, type, name }
  const [search, setSearch]         = useState('')
  const [filterLabel, setFilterLabel] = useState('All')
  const [storageStats, setStorageStats] = useState(null)
  const [exportingZip, setExportingZip] = useState(false)
  const [sortBy, setSortBy]         = useState('newest')
  const previewRef = useRef()

  useEffect(() => {
    if (unlocked) vaultGetStorageStats().then(setStorageStats)
  }, [unlocked])

  // Close preview on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setPreviewUrl(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const unlock = async () => {
    setError('')
    if (!passphrase) return
    const all = await vaultListAll()
    const ids = Object.keys(all)
    if (ids.length === 0) { setVaults({}); setUnlocked(true); return }
    // Verify passphrase against first vault that has something
    const first = all[ids[0]]
    try {
      if (first.encMsg)     await decryptText(first.encMsg, passphrase)
      else if (first.encSender)  await decryptText(first.encSender, passphrase)
      else if (first.encSubject) await decryptText(first.encSubject, passphrase)
      else {
        const files = await vaultGetFiles(ids[0])
        if (files.length > 0) await decryptText(files[0].encName, passphrase)
      }
      setVaults(all)
      setUnlocked(true)
    } catch {
      setError("Wrong passphrase — decryption failed.")
    }
  }

  const openVault = async (id) => {
    if (decrypted[id]) { setSelected(id); return }
    setDecryptingId(id)
    const v = vaults[id]
    try {
      const msg     = v.encMsg     ? await decryptText(v.encMsg,     passphrase) : null
      const sender  = v.encSender  ? await decryptText(v.encSender,  passphrase) : null
      const subject = v.encSubject ? await decryptText(v.encSubject, passphrase) : null
      const fileRecs = await vaultGetFiles(id)
      const files = await Promise.all(fileRecs.map(async f => ({
        name: await decryptText(f.encName, passphrase),
        type: await decryptText(f.encType, passphrase),
        size: f.size,
        index: f.index,
        // Keep encrypted refs for lazy download
        _encName: f.encName, _encType: f.encType, _salt: f.salt, _chunks: f.chunks
      })))
      // Verify header signature if present
      let sigValid = null
      if (v.headerSig && v.headerSalt) {
        try {
          const saltBytes = Uint8Array.from(atob(v.headerSalt), c => c.charCodeAt(0))
          const headerObj = { id, fileCount: v.fileCount, totalSize: v.totalSize, ts: v.ts, label: v.label, priority: v.priority, expireAfterDays: v.expireAfterDays, burnOnOpen: v.burnOnOpen }
          sigValid = await verifyHeader(headerObj, v.headerSig, passphrase, saltBytes)
        } catch { sigValid = false }
      }
      setDecrypted(d => ({ ...d, [id]: { msg, sender, subject, files, sigValid } }))
      setSelected(id)
      // Mark opened + handle burn-on-open
      await vaultMarkOpened(id)
      if (v.burnOnOpen) {
        await new Promise(r => setTimeout(r, 800)) // brief moment to see content
        await vaultDeleteById(id)
        setVaults(prev => { const n = {...prev}; delete n[id]; return n })
        setDecrypted(prev => { const n = {...prev}; delete n[id]; return n })
        setSelected(null)
        alert('🔥 Vault burned — self-deleted after first open, as configured.')
        return
      }
      setVaults(prev => ({ ...prev, [id]: { ...prev[id], opened: true, openedAt: Date.now() } }))
    } catch(e) {
      alert('Decryption failed: ' + e.message)
    }
    setDecryptingId(null)
  }

  const downloadFile = async (vaultId, fileIdx, autoPreview = false) => {
    const key = `${vaultId}_${fileIdx}`
    setDlStatus(s => ({ ...s, [key]: 'loading' }))
    setDlProgress(p => ({ ...p, [key]: 0 }))
    try {
      const fileRec  = (await vaultGetFiles(vaultId))[fileIdx]
      const decInfo  = decrypted[vaultId].files[fileIdx]
      const salt     = fileRec.salt instanceof Uint8Array ? fileRec.salt : new Uint8Array(fileRec.salt)
      const chunks   = fileRec.chunks.map(c => c instanceof Uint8Array ? c : new Uint8Array(c))
      const bytes    = await decryptFileChunked(salt, chunks, passphrase, (pct) => {
        setDlProgress(p => ({ ...p, [key]: pct }))
      })
      const blob = new Blob([bytes], { type: decInfo.type || 'application/octet-stream' })
      const url  = URL.createObjectURL(blob)
      if (autoPreview && isPreviewable(decInfo.type)) {
        setPreviewUrl({ url, type: decInfo.type, name: decInfo.name })
      } else {
        const a = document.createElement('a')
        a.href = url; a.download = decInfo.name; a.click()
        URL.revokeObjectURL(url)
      }
      setDlStatus(s => ({ ...s, [key]: 'done' }))
      setTimeout(() => setDlStatus(s => { const n={...s}; delete n[key]; return n }), 3000)
    } catch(e) {
      setDlStatus(s => ({ ...s, [key]: 'error' }))
    }
  }

  const previewFile = (vaultId, fileIdx) => downloadFile(vaultId, fileIdx, true)

  const downloadAllAsZip = async (id) => {
    // Manual ZIP using stored blobs — iterate all files
    setExportingZip(true)
    const dec  = decrypted[id]
    if (!dec) { setExportingZip(false); return }
    try {
      // Dynamically load JSZip from CDN
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
          s.onload = resolve; s.onerror = reject
          document.head.appendChild(s)
        })
      }
      const zip = new window.JSZip()
      const fileRecs = await vaultGetFiles(id)
      for (let i = 0; i < dec.files.length; i++) {
        const f    = dec.files[i]
        const rec  = fileRecs[i]
        const salt = rec.salt instanceof Uint8Array ? rec.salt : new Uint8Array(rec.salt)
        const cks  = rec.chunks.map(c => c instanceof Uint8Array ? c : new Uint8Array(c))
        const bytes = await decryptFileChunked(salt, cks, passphrase, () => {})
        zip.file(f.name, bytes)
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = `mail-${id.slice(0,8)}.zip`; a.click()
      URL.revokeObjectURL(url)
    } catch(e) { alert('ZIP export failed: ' + e.message) }
    setExportingZip(false)
  }

  const deleteVault = async (id) => {
    if (!confirm('Delete this vault permanently? This cannot be undone.')) return
    await vaultDeleteById(id)
    setVaults(v => { const n={...v}; delete n[id]; return n })
    setDecrypted(d => { const n={...d}; delete n[id]; return n })
    if (selected === id) setSelected(null)
  }

  // ── Filtering + sorting ─────────────────────────────────────────────────
  const vaultIds = Object.keys(vaults)
  const uniqueLabels = ['All', ...new Set(vaultIds.map(id => vaults[id].label || 'None').filter(l => l !== 'None'))]
  const filtered = vaultIds.filter(id => {
    const v = vaults[id]
    const dec = decrypted[id]
    if (filterLabel !== 'All' && v.label !== filterLabel) return false
    if (search) {
      const q = search.toLowerCase()
      const inSender  = dec?.sender?.toLowerCase().includes(q)
      const inSubject = dec?.subject?.toLowerCase().includes(q)
      const inMsg     = dec?.msg?.toLowerCase().includes(q)
      const inTags    = (v.tags||[]).some(t => t.toLowerCase().includes(q))
      const inId      = id.includes(q)
      if (!inSender && !inSubject && !inMsg && !inTags && !inId) return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return vaults[b].ts - vaults[a].ts
    if (sortBy === 'oldest') return vaults[a].ts - vaults[b].ts
    if (sortBy === 'size')   return (vaults[b].totalSize||0) - (vaults[a].totalSize||0)
    if (sortBy === 'priority') {
      const po = { Critical: 2, High: 1, Normal: 0 }
      return (po[vaults[b].priority]||0) - (po[vaults[a].priority]||0)
    }
    return 0
  })

  const selectedVault = selected ? vaults[selected] : null
  const selectedDec   = selected ? decrypted[selected] : null

  // ── Unlock screen ──────────────────────────────────────────────────────
  if (!unlocked) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button onClick={() => nav('/')} className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors">
          <span className="text-xl">🔒</span>
          <span className="font-black text-mail-400 text-lg">SecureMail</span>
        </button>
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Open Inbox</h1>
            <p className="text-slate-400 text-sm">Enter your shared passphrase to decrypt and view all vaults on this device.</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Passphrase</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && unlock()}
                placeholder="Enter passphrase..."
                autoFocus
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mail-500 placeholder-slate-600 pr-14"/>
              <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">{showPass ? 'Hide' : 'Show'}</button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">❌ {error}</p>}
          </div>
          <button onClick={unlock} disabled={!passphrase}
            className="w-full bg-mail-600 hover:bg-mail-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
            Unlock Inbox →
          </button>
          <button onClick={() => nav('/send')} className="w-full border border-dark-700 text-slate-400 hover:text-white font-bold py-3 rounded-xl transition-all text-sm">
            + Send a New Vault
          </button>
        </div>
      </div>
    </div>
  )

  // ── Main inbox ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      {/* File preview overlay */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onClick={() => setPreviewUrl(null)} ref={previewRef}>
          <div className="max-w-4xl w-full max-h-screen flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <p className="text-white font-bold truncate mr-4">{previewUrl.name}</p>
              <div className="flex gap-2">
                <button onClick={() => { const a=document.createElement('a'); a.href=previewUrl.url; a.download=previewUrl.name; a.click() }}
                  className="text-xs bg-mail-600 hover:bg-mail-500 text-white px-3 py-1.5 rounded-lg font-bold">⬇ Download</button>
                <button onClick={() => setPreviewUrl(null)} className="text-slate-400 hover:text-white text-2xl leading-none px-2">✕</button>
              </div>
            </div>
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-dark-900 border border-dark-700 flex items-center justify-center">
              {previewUrl.type.startsWith('image/') && (
                <img src={previewUrl.url} alt={previewUrl.name} className="max-w-full max-h-[75vh] object-contain"/>
              )}
              {previewUrl.type.startsWith('video/') && (
                <video src={previewUrl.url} controls autoPlay className="max-w-full max-h-[75vh]"/>
              )}
              {previewUrl.type.startsWith('audio/') && (
                <div className="p-8 text-center">
                  <p className="text-4xl mb-4">🎵</p>
                  <p className="text-white font-bold mb-4">{previewUrl.name}</p>
                  <audio src={previewUrl.url} controls autoPlay className="w-full"/>
                </div>
              )}
              {previewUrl.type === 'application/pdf' && (
                <iframe src={previewUrl.url} className="w-full h-[75vh]" title={previewUrl.name}/>
              )}
              {previewUrl.type.startsWith('text/') && (
                <iframe src={previewUrl.url} className="w-full h-[75vh] bg-white" title={previewUrl.name}/>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <nav className="border-b border-dark-800 px-4 py-3 flex items-center justify-between max-w-7xl mx-auto w-full">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span>✉️</span><span className="font-black text-mail-400">SecureMail</span>
        </button>
        <div className="flex items-center gap-3">
          {storageStats && storageStats.quota > 0 && (
            <span className="text-xs text-slate-600 hidden md:block">
              {fmtSize(storageStats.used)} used / {fmtSize(storageStats.quota)} quota
            </span>
          )}
          <span className="text-xs text-slate-600 hidden sm:block">🔓 Unlocked</span>
          <button onClick={() => nav('/send')} className="text-sm bg-mail-600 hover:bg-mail-500 text-white font-black px-4 py-2 rounded-lg transition-all">+ New Vault</button>
        </div>
      </nav>

      <div className="flex flex-1 min-h-0 max-w-7xl mx-auto w-full">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 border-r border-dark-800 flex flex-col">
          {/* Search + filters */}
          <div className="p-3 border-b border-dark-800 space-y-2">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search decrypted vaults..."
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-mail-500 placeholder-slate-600"/>
            <div className="flex gap-2 flex-wrap">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-xs bg-dark-800 border border-dark-700 text-slate-400 rounded-lg px-2 py-1 focus:outline-none">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="size">Largest</option>
                <option value="priority">Priority</option>
              </select>
              <select value={filterLabel} onChange={e => setFilterLabel(e.target.value)}
                className="text-xs bg-dark-800 border border-dark-700 text-slate-400 rounded-lg px-2 py-1 focus:outline-none flex-1">
                {uniqueLabels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Vault list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-600 text-sm">
                {vaultIds.length === 0 ? 'No vaults yet.\nSend one to get started.' : 'No vaults match your search.'}
              </div>
            ) : (
              filtered.map(id => {
                const v   = vaults[id]
                const dec = decrypted[id]
                const isNew = !v.opened
                const expired = v.expireAfterDays > 0 && Date.now() - v.ts > v.expireAfterDays * 86400000
                return (
                  <button key={id} onClick={() => openVault(id)}
                    className={`w-full text-left px-4 py-3 border-b border-dark-800 transition-all hover:bg-dark-800
                      ${selected === id ? 'bg-dark-800 border-l-2 border-l-mail-500' : ''}
                      ${decryptingId === id ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isNew && <span className="w-2 h-2 rounded-full bg-mail-400 flex-shrink-0 mt-0.5"/>}
                          {v.priority && v.priority !== 'Normal' && (
                            <span className="text-xs">{PRIORITY_ICON[v.priority]}</span>
                          )}
                          <p className={`text-sm font-bold truncate ${isNew ? 'text-white' : 'text-slate-300'}`}>
                            {dec?.subject || (dec?.sender ? `From ${dec.sender}` : `Vault ${id.slice(0,8)}`)}
                          </p>
                        </div>
                        <p className="text-slate-500 text-xs truncate">
                          {dec?.sender || '— encrypted —'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-600 text-xs">{timeAgo(v.ts)}</span>
                          {v.fileCount > 0 && <span className="text-slate-600 text-xs">· {v.fileCount} file{v.fileCount !== 1 ? 's' : ''}</span>}
                          {fmtSize(v.totalSize||0) !== '0 B' && <span className="text-slate-600 text-xs">· {fmtSize(v.totalSize||0)}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {v.label && v.label !== 'None' && (
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${LABEL_COLORS[v.label] || ''}`}>{v.label}</span>
                          )}
                          {v.burnOnOpen && <span className="text-xs text-red-500">🔥</span>}
                          {expired && <span className="text-xs text-red-500">Expired</span>}
                          {v.tags?.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-dark-700 text-slate-500">{t}</span>)}
                        </div>
                      </div>
                      {decryptingId === id && <div className="w-4 h-4 border-2 border-mail-500 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-1"/>}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div className="p-3 border-t border-dark-800">
            <p className="text-xs text-slate-600 text-center">{vaultIds.length} vault{vaultIds.length !== 1 ? 's' : ''} on this device</p>
          </div>
        </div>

        {/* ── Detail pane ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {!selected || !selectedVault ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <p className="text-6xl mb-4">✉️</p>
                <p className="text-slate-400 font-bold text-lg">Select a vault to open it</p>
                <p className="text-slate-600 text-sm mt-1">All content decrypts locally in your browser.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white">
                    {selectedDec?.subject || (selectedDec?.sender ? `From ${selectedDec.sender}` : `Vault ${selected.slice(0,8)}`)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {selectedDec?.sender && <span className="text-slate-400 text-sm">From: <strong className="text-white">{selectedDec.sender}</strong></span>}
                    <span className="text-slate-600 text-sm">{timeAgo(selectedVault.ts)}</span>
                    {selectedVault.label && selectedVault.label !== 'None' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${LABEL_COLORS[selectedVault.label]}`}>{selectedVault.label}</span>
                    )}
                    {selectedVault.priority && selectedVault.priority !== 'Normal' && (
                      <span className={`text-xs font-bold ${PRIORITY_COLORS[selectedVault.priority]}`}>{PRIORITY_ICON[selectedVault.priority]} {selectedVault.priority}</span>
                    )}
                    {selectedVault.opened && selectedVault.openedAt && (
                      <span className="text-xs text-slate-600">✓ Opened {timeAgo(selectedVault.openedAt)}</span>
                    )}
                    {selectedDec?.sigValid === true && (
                      <span className="text-xs text-mail-500 font-bold">🔏 Header verified</span>
                    )}
                    {selectedDec?.sigValid === false && (
                      <span className="text-xs text-red-400 font-bold">⚠️ Header signature invalid</span>
                    )}
                  </div>
                  {selectedVault.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedVault.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-dark-700 text-slate-400">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {selectedDec?.files?.length > 1 && (
                    <button onClick={() => downloadAllAsZip(selected)} disabled={exportingZip}
                      className="text-xs bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-300 px-3 py-2 rounded-lg font-bold transition-all disabled:opacity-50">
                      {exportingZip ? '⏳ Zipping...' : '🗜️ Export ZIP'}
                    </button>
                  )}
                  <button onClick={() => deleteVault(selected)}
                    className="text-xs bg-dark-800 hover:bg-red-900/40 border border-dark-700 hover:border-red-800 text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg font-bold transition-all">
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Expiry / burn notice */}
              {selectedVault.expireAfterDays > 0 && (
                <div className="bg-orange-900/20 border border-orange-800 rounded-xl px-4 py-2 text-xs text-orange-400">
                  ⏳ This vault expires {selectedVault.expireAfterDays} day{selectedVault.expireAfterDays !== 1 ? 's' : ''} after creation
                  {' '}({timeAgo(selectedVault.ts + selectedVault.expireAfterDays * 86400000).includes('ago') ? 'EXPIRED' : `in ~${selectedVault.expireAfterDays} days`})
                </div>
              )}

              {/* Message body */}
              {selectedDec?.msg && (
                <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Message</p>
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{selectedDec.msg}</p>
                </div>
              )}

              {/* Files */}
              {selectedDec?.files && selectedDec.files.length > 0 && (
                <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">
                      {selectedDec.files.length} File{selectedDec.files.length !== 1 ? 's' : ''} · {fmtSize(selectedVault.totalSize)}
                    </p>
                  </div>
                  <div className="divide-y divide-dark-800">
                    {selectedDec.files.map((f, i) => {
                      const dlKey = `${selected}_${i}`
                      const ds    = dlStatus[dlKey]
                      const dp    = dlProgress[dlKey] || 0
                      const canPreview = isPreviewable(f.type)
                      return (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl flex-shrink-0">{fileIcon(f.name, f.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-sm truncate">{f.name}</p>
                              <p className="text-slate-500 text-xs">{fmtSize(f.size)}</p>
                              {ds === 'loading' && dp > 0 && dp < 1 && (
                                <div className="mt-1.5 w-full bg-dark-700 rounded-full h-1">
                                  <div className="bg-mail-500 h-1 rounded-full transition-all" style={{width:`${dp*100}%`}}/>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {canPreview && (
                                <button onClick={() => previewFile(selected, i)} disabled={ds === 'loading'}
                                  className="text-xs border border-mail-700 text-mail-400 hover:bg-mail-900 px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-40">
                                  👁 Preview
                                </button>
                              )}
                              <button onClick={() => downloadFile(selected, i)} disabled={ds === 'loading'}
                                className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all
                                  ${ds === 'done'    ? 'bg-green-700 text-white' :
                                    ds === 'loading' ? 'bg-dark-700 text-slate-500' :
                                    ds === 'error'   ? 'bg-red-800 text-white' :
                                    'bg-mail-600 hover:bg-mail-500 text-white'}`}>
                                {ds === 'done' ? '✓ Saved' : ds === 'loading' ? `${Math.round(dp*100)}%` : ds === 'error' ? 'Error' : '⬇ Save'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Vault metadata */}
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
                <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">Vault Details</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-slate-600">Vault ID</p><p className="font-mono text-slate-400 truncate">{selected}</p></div>
                  <div><p className="text-slate-600">Created</p><p className="text-slate-400">{new Date(selectedVault.ts).toLocaleString()}</p></div>
                  <div><p className="text-slate-600">Encryption</p><p className="text-slate-400">AES-256-GCM · PBKDF2 600k</p></div>
                  <div><p className="text-slate-600">Storage</p><p className="text-slate-400">IndexedDB (local)</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
