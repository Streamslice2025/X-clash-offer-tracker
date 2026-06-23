import { useState } from 'react'
import { buildDiscordText, buildDiscordEmbed, buildRanking, calcScore } from '../calc.js'

export default function ExportModal({ pkg, packages, rates, onClose }) {
  const [mode, setMode] = useState('text')
  const [copied, setCopied] = useState(false)

  const score = pkg ? calcScore(pkg, rates) : null

  function output() {
    if (!pkg && mode !== 'ranking') return ''
    if (mode === 'ranking') return buildRanking(packages, rates)
    if (mode === 'embed') return JSON.stringify(buildDiscordEmbed(pkg, score, rates), null, 2)
    return buildDiscordText(pkg, score, rates)
  }

  function copy() {
    navigator.clipboard.writeText(output())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: '#13122a', border: '1px solid #4c1d95', borderRadius: 12, padding: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ color: '#a78bfa', fontSize: 15 }}>📤 Discord Export</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[['text', '📋 Text'], ['embed', '🔗 Embed'], ['ranking', '📊 Ranking']].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)}
              style={{ padding: '7px 12px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: mode === k ? '#7c3aed' : '#1e1b4b', color: mode === k ? '#fff' : '#94a3b8' }}>
              {l}
            </button>
          ))}
        </div>

        {mode === 'embed' && <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>POST diesen JSON an deine Discord Webhook URL.</p>}
        {mode === 'ranking' && <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Vollständiges Value-Ranking aller {packages.length} Pakete.</p>}

        <textarea readOnly value={output()} style={{ width: '100%', height: 280, background: '#0c0c18', border: '1px solid #2d2b52', borderRadius: 7, color: '#e2e8f0', padding: '8px 10px', fontSize: 11, fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />

        <button onClick={copy} style={{ marginTop: 10, background: copied ? '#10b981' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 7, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          {copied ? '✓ Kopiert!' : '📋 Kopieren'}
        </button>
      </div>
    </div>
  )
}
