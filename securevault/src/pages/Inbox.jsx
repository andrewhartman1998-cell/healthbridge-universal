import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { decryptText, decryptBytes, vaultList, vaultDelete, fmtSize } from '../crypto'

function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return Math.floor(diff / 86400000) + 'd ago'
}

export default function Inbox() {
  const nav = useNavigate()
  const [passphrase, setPassphrase] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [vaults, setVaults] = useState({})
  const [decrypted, setDecrypted] = useState({})
  const [decrypting, setDecrypting] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [selected, setSelected] = useState(null)
  const [downloadStatus, setDownloadStatus] = useState({})

  const unlock = async () => {
    if (!passphrase) return
    setError('')
    const all = vaultList()
    const ids = Object.keys(all)
    if (ids.length === 0) {
      setVaults({})
      setUnlocked(true)
      return
    }
    // Try decrypting one vault to verify passphrase
    const first = all[ids[0]]
    try {
      if (first.encMsg) await decryptText(first.encMsg, passphrase)
      else if (first.encSender) await decryptText(first.encSender, passphrase)
      else if (first.encFiles && first.encFiles.length > 0) await decryptText(first.encFiles[0].encName, passphrase)
      setVaults(all)
      setUnlocked(true)
    } catch {
      setError('❌ Wrong passphrase — decryption failed. Make sure you\'re using the same passphrase the sender used.')
    }
  }

  const decryptVault = async (id) => {
    setDecrypting(d => ({ ...d, [id]: true }))
    const v = vaults[id]
    try {
      const msg = v.encMsg ? await decryptText(v.encMsg, passphrase) : null
      const sender = v.encSender ? await decryptText(v.encSender, passphrase) : null
      const files = []
      for (const ef of (v.encFiles || [])) {
        const name = await decryptText(ef.encName, passphrase)
        const type = await decryptText(ef.encType, passphrase)
        files.push({ name, type, encData: ef.encData, size: ef.size })
      }
      setDecrypted(d => ({ ...d, [id]: { msg, sender, files } }))
      setSelected(id)
    } catch (e) {
      alert('Decryption failed: ' + e.message)
    }
    setDecrypting(d => ({ ...d, [id]: false }))
  }

  const downloadFile = async (id, fileIdx) => {
    const key = `${id}_${fileIdx}`
    setDownloadStatus(s => ({ ...s, [key]: 'decrypting' }))
    try {
      const ef = vaults[id].encFiles[fileIdx]
      const f = decrypted[id].files[fileIdx]
      const bytes = await decryptBytes(ef.encData, passphrase)
      const blob = new Blob([bytes], { type: f.type || 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = f.name; a.click()
      URL.revokeObjectURL(url)
      setDownloadStatus(s => ({ ...s, [key]: 'done' }))
      setTimeout(() => setDownloadStatus(s => { const n = { ...s }; delete n[key]; return n }), 3000)
    } catch (e) {
      setDownloadStatus(s => ({ ...s, [key]: 'error' }))
    }
  }

  const deleteVault = (id) => {
    if (!confirm('Delete this vault permanently? This cannot be undone.')) return
    vaultDelete(id)
    setVaults(v => { const n = { ...v }; delete n[id]; return n })
    setDecrypted(d => { const n = { ...d }; delete n[id]; return n })
    if (selected === id) setSelected(null)
  }

  const vaultIds = Object.keys(vaults)

  if (!unlocked) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button onClick={() => nav('/')} className="flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-colors">
          <span className="text-xl">🔒</span>
          <span className="font-black text-vault-400">SecureVault</span>
        </button>
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8">
          <div className="text-5xl text-center mb-4">🔒</div>
          <h1 className="text-2xl font-black text-white text-center mb-2">Open Your Inbox</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Enter your passphrase to decrypt and view your received vaults.</p>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passphrase}
                onChange={e => { setPassphrase(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && unlock()}
                placeholder="Enter your passphrase..."
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vault-500 placeholder-slate-600 pr-12"
              />
              <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">{showPass ? 'Hide' : 'Show'}</button>
            </div>
            {error && <div className="bg-red-900/20 border border-red-800 rounded-xl p-3"><p className="text-red-300 text-xs">{error}</p></div>}
            <button onClick={unlock} disabled={!passphrase}
              className="w-full bg-vault-600 hover:bg-vault-500 disabled:bg-dark-700 disabled:text-slate-600 text-white font-black py-3 rounded-xl transition-all">
              Unlock Inbox 🔓
            </button>
          </div>
          <p className="text-slate-600 text-xs text-center mt-4">Decryption happens entirely in your browser. Your passphrase is never sent anywhere.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <nav className="border-b border-dark-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <button onClick={() => nav('/')} className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <span className="font-black text-vault-400">SecureVault</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-vault-400 text-xs font-bold">🔓 Inbox Unlocked</span>
          <button onClick={() => nav('/send')} className="text-sm bg-vault-600 hover:bg-vault-500 text-white font-bold px-4 py-2 rounded-lg transition-all">Send Securely →</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        {/* Vault list */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white">Inbox</h2>
            <span className="text-xs bg-vault-900 text-vault-400 px-2 py-1 rounded-full font-bold">{vaultIds.length} vault{vaultIds.length !== 1 ? 's' : ''}</span>
          </div>
          {vaultIds.length === 0 ? (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-400 font-bold text-sm">No vaults yet</p>
              <p className="text-slate-600 text-xs mt-1">Share the Send link with your clients and tell them to use your passphrase.</p>
              <button onClick={() => nav('/send')} className="mt-4 text-xs bg-vault-700 hover:bg-vault-600 text-white font-bold px-4 py-2 rounded-lg transition-all">Send a Test Vault</button>
            </div>
          ) : (
            <div className="space-y-2">
              {vaultIds.map(id => {
                const v = vaults[id]
                const dec = decrypted[id]
                return (
                  <div key={id}
                    onClick={() => dec ? setSelected(id) : decryptVault(id)}
                    className={`bg-dark-900 border rounded-xl p-4 cursor-pointer transition-all ${selected === id ? 'border-vault-600' : 'border-dark-800 hover:border-dark-700'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">{dec?.sender || 'Anonymous'}</p>
                        <p className="text-slate-500 text-xs">{timeAgo(v.ts)}</p>
                        <p className="text-slate-600 text-xs mt-1">
                          {v.fileCount || 0} file{v.fileCount !== 1 ? 's' : ''} · {fmtSize(v.totalSize || 0)}
                        </p>
                      </div>
                      <div className="text-xl flex-shrink-0">{dec ? '🔓' : '🔒'}</div>
                    </div>
                    {decrypting[id] && <p className="text-vault-400 text-xs mt-2 font-bold">🔐 Decrypting...</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail pane */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">🔐</div>
              <p className="text-slate-400 font-bold">Select a vault to decrypt and view its contents</p>
              <p className="text-slate-600 text-xs mt-2">All decryption happens locally in your browser</p>
            </div>
          ) : (() => {
            const dec = decrypted[selected]
            const v = vaults[selected]
            if (!dec) return null
            return (
              <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-dark-800 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-black text-white text-lg">{dec.sender || 'Anonymous Sender'}</p>
                    <p className="text-slate-500 text-xs">{timeAgo(v.ts)} · {v.fileCount} file{v.fileCount !== 1 ? 's' : ''} · {fmtSize(v.totalSize || 0)} · 🔓 Decrypted</p>
                  </div>
                  <button onClick={() => deleteVault(selected)} className="text-red-500 hover:text-red-400 text-sm font-bold px-3 py-1.5 border border-red-900 hover:border-red-700 rounded-lg transition-all">Delete</button>
                </div>

                {/* Message */}
                {dec.msg && (
                  <div className="px-6 py-5 border-b border-dark-800">
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Encrypted Message</p>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{dec.msg}</p>
                  </div>
                )}

                {/* Files */}
                {dec.files.length > 0 && (
                  <div className="px-6 py-5">
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">{dec.files.length} Encrypted File{dec.files.length !== 1 ? 's' : ''}</p>
                    <div className="space-y-3">
                      {dec.files.map((f, i) => {
                        const key = `${selected}_${i}`
                        const ds = downloadStatus[key]
                        return (
                          <div key={i} className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl flex-shrink-0">📄</span>
                              <div className="min-w-0">
                                <p className="text-white font-bold text-sm truncate">{f.name}</p>
                                <p className="text-slate-500 text-xs">{fmtSize(f.size)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => downloadFile(selected, i)}
                              disabled={ds === 'decrypting'}
                              className={`flex-shrink-0 ml-3 text-xs font-black px-4 py-2 rounded-xl transition-all ${
                                ds === 'done' ? 'bg-green-700 text-white' :
                                ds === 'decrypting' ? 'bg-dark-700 text-slate-600' :
                                ds === 'error' ? 'bg-red-800 text-white' :
                                'bg-vault-600 hover:bg-vault-500 text-white'
                              }`}>
                              {ds === 'done' ? '✓ Saved' : ds === 'decrypting' ? 'Decrypting...' : ds === 'error' ? 'Error' : '⬇ Download'}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
