import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { calcScore, scoreInfo, calcRates } from './calc.js'
import { DEFAULT_BASELINES } from './gameData.js'
import PackCard from './components/PackCard.jsx'
import PackForm from './components/PackForm.jsx'
import ExportModal from './components/ExportModal.jsx'

const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'
const CATEGORY_TABS = ['Daily', 'Weekly', 'Event', 'All']
const TAG_TO_CAT = {
  'Daily Special': 'Daily', 'Daily Must-Buy': 'Daily',
  'Weekly': 'Weekly',
  'Event': 'Event', 'Flash Deal': 'Event', 'Battle Pass': 'Event',
}

export default function App() {
  const [packages, setPackages]   = useState([])
  const [baselines, setBaselines] = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('Daily')    // Daily | Weekly | Event | All
  const [view, setView]           = useState('list')     // list | add | edit | baselines
  const [editPkg, setEditPkg]     = useState(null)
  const [sortBy, setSortBy]       = useState('score')
  const [exportData, setExportData] = useState(null)     // { pkg } or { ranking: true }
  const [isAdmin, setIsAdmin]     = useState(false)
  const [pwInput, setPwInput]     = useState('')
  const [pwError, setPwError]     = useState(false)
  const [toast, setToast]         = useState('')

  // Load data from Supabase
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [{ data: pkgs }, { data: bls }] = await Promise.all([
        supabase.from('packages').select('*').order('created_at', { ascending: false }),
        supabase.from('baselines').select('*').order('created_at', { ascending: true }),
      ])
      setPackages(pkgs || [])
      if (bls && bls.length > 0) {
        setBaselines(bls)
      } else {
        // Seed default baselines on first load
        const { data: inserted } = await supabase.from('baselines').insert(DEFAULT_BASELINES).select()
        setBaselines(inserted || DEFAULT_BASELINES)
      }
    } catch (e) {
      console.error(e)
      showToast('Fehler beim Laden — Supabase konfiguriert?')
    }
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function handleAdminLogin() {
    if (pwInput === ADMIN_PW) { setIsAdmin(true); setPwError(false); setPwInput('') }
    else { setPwError(true) }
  }

  // Filtered + sorted packages
  const rates = calcRates(baselines)
  const filtered = packages
    .filter(p => tab === 'All' || (TAG_TO_CAT[p.tag] || 'Event') === tab)
    .sort((a, b) => {
      if (sortBy === 'score') return (calcScore(b, rates) ?? -1) - (calcScore(a, rates) ?? -1)
      if (sortBy === 'price') return Number(a.price) - Number(b.price)
      return new Date(b.created_at) - new Date(a.created_at)
    })

  async function savePkg(form) {
    const data = { name: form.name, price: Number(form.price), currency: form.currency || 'USD', tag: form.tag || '', notes: form.notes || '', expires_at: form.expires_at || '', items: form.items }
    if (form.id) {
      await supabase.from('packages').update(data).eq('id', form.id)
      setPackages(ps => ps.map(p => p.id === form.id ? { ...p, ...data } : p))
    } else {
      const { data: inserted } = await supabase.from('packages').insert(data).select().single()
      if (inserted) setPackages(ps => [inserted, ...ps])
    }
    setEditPkg(null); setView('list'); showToast('Gespeichert ✓')
  }

  async function deletePkg(id) {
    await supabase.from('packages').delete().eq('id', id)
    setPackages(ps => ps.filter(p => p.id !== id))
    showToast('Gelöscht')
  }

  return (
    <div style={{ background: '#0c0c18', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%)', padding: '16px 20px 12px', borderBottom: '1px solid #4c1d95' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa', letterSpacing: -0.5 }}>⚔️ X Clash Offer Tracker</div>
            <div style={{ fontSize: 11, color: '#6d28d9', marginTop: 2 }}>Real value · No ingame fluff · Basis: Daily Must-Buy</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isAdmin ? (
              <>
                <span style={{ fontSize: 11, color: '#10b981' }}>🔓 Admin</span>
                <button onClick={() => { setView('add'); setEditPkg(null) }} style={btnPrimary}>➕ Paket</button>
                <button onClick={() => setView('baselines')} style={btnSec}>📐 Basis</button>
                <button onClick={() => setIsAdmin(false)} style={btnSec}>Logout</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type='password' value={pwInput} onChange={e => setPwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  placeholder='Admin PW' style={{ background: '#16133a', border: `1px solid ${pwError ? '#f87171' : '#2d2b52'}`, borderRadius: 6, color: '#e2e8f0', padding: '6px 10px', fontSize: 12, width: 110, outline: 'none' }} />
                <button onClick={handleAdminLogin} style={btnSec}>🔐</button>
              </div>
            )}
            <button onClick={() => setExportData({ ranking: true })} style={btnSec}>📤 Ranking</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 12px' }}>
        {view === 'list' && (
          <>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1b4b', marginTop: 4 }}>
              {CATEGORY_TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '10px 16px', border: 'none', background: 'transparent', color: tab === t ? '#a78bfa' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderBottom: tab === t ? '2px solid #7c3aed' : '2px solid transparent' }}>
                  {t}
                  <span style={{ marginLeft: 5, fontSize: 10, background: '#1e1b4b', color: '#6b7280', borderRadius: 10, padding: '1px 6px' }}>
                    {packages.filter(p => t === 'All' || (TAG_TO_CAT[p.tag] || 'Event') === t).length}
                  </span>
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: 12, cursor: 'pointer', padding: '8px', outline: 'none' }}>
                <option value='score'>⭐ Value %</option>
                <option value='price'>💰 Preis</option>
                <option value='date'>🕐 Datum</option>
              </select>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>⏳ Lade Pakete…</div>}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#4b5563' }}>
                Keine {tab} Pakete.{isAdmin && <> <button onClick={() => { setView('add'); setEditPkg(null) }} style={{ ...btnPrimary, marginLeft: 8 }}>➕ Hinzufügen</button></>}
              </div>
            )}

            <div style={{ paddingTop: 12 }}>
              {filtered.map(pkg => (
                <PackCard key={pkg.id} pkg={pkg} rates={rates} isAdmin={isAdmin}
                  onEdit={p => { setEditPkg(p); setView('edit') }}
                  onDelete={deletePkg}
                  onExport={p => setExportData({ pkg: p })} />
              ))}
            </div>
          </>
        )}

        {(view === 'add' || view === 'edit') && (
          <div style={{ paddingTop: 16 }}>
            <PackForm initial={editPkg} rates={rates}
              onSave={savePkg}
              onCancel={() => { setEditPkg(null); setView('list') }} />
          </div>
        )}

        {view === 'baselines' && (
          <BaselinesView baselines={baselines} setBaselines={setBaselines} showToast={showToast} />
        )}
      </div>

      {/* Export Modal */}
      {exportData && (
        <ExportModal
          pkg={exportData.pkg || null}
          packages={packages}
          rates={rates}
          onClose={() => setExportData(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', borderRadius: 8, padding: '10px 22px', fontSize: 13, fontWeight: 700, zIndex: 2000, boxShadow: '0 4px 20px #7c3aed55' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── Baselines View ───────────────────────────────────────────────────────────
function BaselinesView({ baselines, setBaselines, showToast }) {
  return (
    <div style={{ paddingTop: 16, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ color: '#a78bfa', fontSize: 16 }}>📐 Basis-Pakete ({baselines.length})</h2>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 14 }}>
        Schlechtester $/Unit-Wert je Item-Typ wird als Anker genutzt. Alle anderen Pakete werden dagegen gerechnet.
      </p>
      {baselines.map(b => (
        <div key={b.id} style={{ background: '#13122a', border: '1px solid #2d2b52', borderRadius: 9, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{b.name}</span>
            <span style={{ color: '#a78bfa', fontSize: 12 }}>{b.currency || 'USD'} {Number(b.price).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {(b.items || []).map((item, i) => (
              <span key={i} style={{ background: '#1e1b4b', color: '#93c5fd', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>
                {item.qty?.toLocaleString()}× {item.typeId}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const btnPrimary = { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }
const btnSec = { background: '#1e1b4b', color: '#a78bfa', border: '1px solid #4c1d95', borderRadius: 7, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }
