import { useState, useEffect, useRef } from 'react'
import { ITEM_TYPES, ITEM_CATS, ITEM_MAP, HEROES, PKG_TAGS } from '../gameData.js'
import { calcScore, proPerDollar, speedHours, itemLabel, fmtH, fmtPer, scoreInfo } from '../calc.js'
import { ScoreBadge } from './PackCard.jsx'

const S = {
  lbl: { display: 'block', fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3, marginTop: 12 },
  inp: { width: '100%', background: '#16133a', border: '1px solid #2d2b52', borderRadius: 6, color: '#e2e8f0', padding: '8px 10px', fontSize: 13, boxSizing: 'border-box', outline: 'none' },
  sel: { background: '#16133a', border: '1px solid #2d2b52', borderRadius: 6, color: '#e2e8f0', padding: '7px 9px', fontSize: 12, outline: 'none', cursor: 'pointer' },
  btnPrimary: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 7, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnSec: { background: '#1e1b4b', color: '#a78bfa', border: '1px solid #4c1d95', borderRadius: 7, padding: '9px 18px', fontSize: 13, cursor: 'pointer' },
  btnSm: { background: '#1e1b4b', color: '#94a3b8', border: '1px solid #2d2b52', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' },
  btnDanger: { background: '#450a0a', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' },
}

function ItemRow({ item, onChange, onRemove }) {
  const t = ITEM_MAP[item.typeId] || ITEM_TYPES[0]
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
      <select value={item.typeId} onChange={e => onChange({ ...item, typeId: e.target.value, hero: '' })}
        style={{ ...S.sel, flex: '1 1 160px', fontSize: 11 }}>
        {ITEM_CATS.map(cat => (
          <optgroup key={cat} label={cat}>
            {ITEM_TYPES.filter(x => x.cat === cat).map(x => <option key={x.id} value={x.id}>{x.icon} {x.label}</option>)}
          </optgroup>
        ))}
      </select>
      {t.heroSpecific && (
        <select value={item.hero || ''} onChange={e => onChange({ ...item, hero: e.target.value })} style={{ ...S.sel, width: 95, fontSize: 11 }}>
          <option value=''>Hero…</option>
          {HEROES.map(h => <option key={h}>{h}</option>)}
        </select>
      )}
      <input type='number' min='0' value={item.qty} onChange={e => onChange({ ...item, qty: Number(e.target.value) })} placeholder='Qty' style={{ ...S.inp, width: 75 }} />
      <button onClick={onRemove} style={S.btnDanger}>✕</button>
    </div>
  )
}

export default function PackForm({ initial, rates, onSave, onCancel }) {
  const blank = { name: '', price: '', currency: 'USD', tag: '', notes: '', expires_at: '', items: [{ typeId: 'diamonds', qty: 0, hero: '' }] }
  const [form, setForm] = useState(initial || blank)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const fileRef = useRef()

  useEffect(() => setForm(initial || blank), [initial])

  const score = form.price > 0 ? calcScore({ ...form, price: Number(form.price) }, rates) : null
  const bd = form.price > 0 ? proPerDollar({ ...form, price: Number(form.price) }) : []

  async function analyzeScreenshot(file) {
    setAiLoading(true); setAiError('')
    try {
      const b64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(file) })
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6', max_tokens: 1000,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: file.type || 'image/jpeg', data: b64 } },
            { type: 'text', text: `X Clash mobile game shop screenshot. Extract package data. Return ONLY valid JSON, no markdown. Do NOT include pack_points.
{"name":"","price":0.99,"currency":"USD","tag":"","notes":"","expires_at":"","items":[{"typeId":"diamonds","qty":100,"hero":""}]}
typeIds: diamonds, gold_res, energy_crystal, stamina, vip_exp_500, vip_exp_1k, vip_exp_2500, hrv, hdv, harv, srv, c5hsc, excl_gear (set hero!), univ_excl_gear, splus_shard, s_shard, a_shard, skill_exp, hero_exp_l, hero_exp_s, leg_gear_scroll, mythic_gear_scroll, gear_boost_chest, specials_key, leg_gear_crystal, epic_gear_crystal, exc_gear_crystal, rare_gear_crystal, common_gear_crystal, upgrade_crystal, mb_exp_potion, mb_exp_10k, mb_breakthrough, mb_rankup_orb, mb_mark_lv3_chest, mb_mark_lv5_chest, mb_mark_lv5_sel, skill_crystal_chest, epic_skill_crystal, leg_skill_crystal, common_crystal_mat, adv_crystal_mat, iron_chest, gold_chest, wheat_chest, union_excellent, union_epic, union_legendary, union_mythic, class_exp_10k, deco_stone, deco_orange, su_5m, su_1h, su_3h, su_8h, su_24h, tsu_5m, tsu_1h, tsu_3h, tsu_8h, tsu_24h, other.
Tags: Daily Special, Daily Must-Buy, Weekly, Flash Deal, Battle Pass, Monthly, Event, Starter, VIP, Bundle, Other.` }
          ]}]
        })
      })
      const data = await resp.json()
      const txt = data.content?.map(c => c.text || '').join('') || ''
      const parsed = JSON.parse(txt.replace(/```json|```/g, '').trim())
      setForm({ ...parsed, id: form.id, items: parsed.items || [] })
    } catch { setAiError('KI konnte Bild nicht auslesen — bitte manuell eingeben.') }
    setAiLoading(false)
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2 style={{ color: '#a78bfa', fontSize: 16, marginBottom: 14 }}>{initial?.id ? '✏️ Paket bearbeiten' : '➕ Neues Paket'}</h2>

      {/* Screenshot AI */}
      <div style={{ background: '#13122a', border: '1px dashed #4c1d95', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>📸 Screenshot hochladen — KI liest automatisch aus</div>
        <input ref={fileRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={e => e.target.files[0] && analyzeScreenshot(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} style={S.btnPrimary} disabled={aiLoading}>
          {aiLoading ? '⏳ Analysiere…' : '🖼️ Screenshot wählen'}
        </button>
        {aiError && <div style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{aiError}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0', color: '#4b5563', fontSize: 11 }}>
        <div style={{ flex: 1, height: 1, background: '#2d2b52' }} /><span>oder manuell</span><div style={{ flex: 1, height: 1, background: '#2d2b52' }} />
      </div>

      <label style={S.lbl}>Name</label>
      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={S.inp} placeholder='Paket Name' />

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}><label style={S.lbl}>Preis</label><input type='number' min='0' step='0.01' value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={S.inp} placeholder='4.99' /></div>
        <div><label style={S.lbl}>Währung</label><select value={form.currency || 'USD'} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} style={S.sel}><option>USD</option><option>EUR</option></select></div>
      </div>

      <label style={S.lbl}>Tag</label>
      <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} style={{ ...S.sel, width: '100%' }}>
        <option value=''>— kein —</option>{PKG_TAGS.map(t => <option key={t}>{t}</option>)}
      </select>

      <label style={S.lbl}>Inhalt</label>
      {form.items.map((item, i) => (
        <ItemRow key={i} item={item}
          onChange={v => setForm(f => { const items = [...f.items]; items[i] = v; return { ...f, items } })}
          onRemove={() => setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} />
      ))}
      <button onClick={() => setForm(f => ({ ...f, items: [...f.items, { typeId: 'diamonds', qty: 0, hero: '' }] }))}
        style={{ ...S.btnSm, marginBottom: 12 }}>+ Item</button>

      <label style={S.lbl}>Läuft ab</label>
      <input value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} style={S.inp} placeholder='25.06.2025 18:00' />

      <label style={S.lbl}>Notizen</label>
      <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...S.inp, height: 55, resize: 'vertical' }} placeholder='Kontext…' />

      {score !== null && (
        <div style={{ margin: '12px 0', background: '#13122a', borderRadius: 8, padding: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Vorschau:</span>
            <ScoreBadge score={score} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {bd.map(({ label, qty, perDollar, isSU }, i) => (
              <span key={i} style={{ background: '#0f2a1a', color: '#86efac', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>
                {label}: {isSU ? `${fmtH(qty)} · ${fmtH(perDollar)}/$` : `${fmtPer(perDollar)}/$`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={() => onSave({ ...form, price: Number(form.price) })} style={S.btnPrimary} disabled={!form.name || !form.price}>💾 Speichern</button>
        <button onClick={onCancel} style={S.btnSec}>Abbrechen</button>
      </div>
    </div>
  )
}
