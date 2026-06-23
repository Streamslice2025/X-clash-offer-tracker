import { calcScore, scoreInfo, proPerDollar, speedHours, itemLabel, fmtH, fmtPer } from '../calc.js'
import { ITEM_MAP, SPEED_CATS } from '../gameData.js'

export default function PackCard({ pkg, rates, isAdmin, onEdit, onDelete, onExport }) {
  const score = calcScore(pkg, rates)
  const { color } = scoreInfo(score)
  const bd = proPerDollar(pkg)
  const totalSU  = pkg.items.reduce((a, i) => ITEM_MAP[i.typeId]?.cat === 'Speed Up'      ? a + speedHours(i) : a, 0)
  const totalTSU = pkg.items.reduce((a, i) => ITEM_MAP[i.typeId]?.cat === 'Tech Speed Up' ? a + speedHours(i) : a, 0)

  return (
    <div style={{ background: '#13122a', border: `1px solid #2d2b52`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{pkg.name}</span>
          {pkg.tag && <span style={{ background: '#312e81', color: '#a78bfa', borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700, marginLeft: 6 }}>{pkg.tag}</span>}
        </div>
        <ScoreBadge score={score} />
      </div>

      {/* Contents */}
      <div style={{ marginTop: 10, borderTop: '1px solid #2d2b52', paddingTop: 8 }}>
        <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>INHALT</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {pkg.items.map((item, i) => {
            const t = ITEM_MAP[item.typeId]
            const isSU = SPEED_CATS.includes(t?.cat)
            return (
              <span key={i} style={{ background: '#1e1b4b', color: '#93c5fd', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>
                {isSU ? `${item.qty}× ${itemLabel(item)} = ${fmtH(speedHours(item))}` : `${item.qty.toLocaleString()}× ${itemLabel(item)}`}
              </span>
            )
          })}
        </div>
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>{pkg.currency || 'USD'} {Number(pkg.price).toFixed(2)}</span>
          {totalSU > 0  && <span style={{ color: '#60a5fa', fontSize: 11 }}>⏩ {fmtH(totalSU)} total</span>}
          {totalTSU > 0 && <span style={{ color: '#34d399', fontSize: 11 }}>🔬 {fmtH(totalTSU)} total</span>}
        </div>
      </div>

      {/* Per dollar */}
      <div style={{ marginTop: 10, borderTop: '1px solid #2d2b52', paddingTop: 8 }}>
        <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>PER $1.00</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {bd.map(({ label, qty, perDollar, isSU }, i) => (
            <span key={i} style={{ background: '#0f2a1a', color: '#86efac', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>
              {label}: <b>{isSU ? `${fmtH(qty)} · ${fmtH(perDollar)}/$` : `${fmtPer(perDollar)}/$`}</b>
            </span>
          ))}
        </div>
        {score !== null && (
          <div style={{ marginTop: 6, fontSize: 11, color: '#94a3b8' }}>
            📈 vs. Baseline: <span style={{ color: scoreInfo(score).color, fontWeight: 700 }}>{score.toFixed(1)}%</span>
            <span style={{ color: '#6b7280', marginLeft: 4 }}>(100% = Must-Buy)</span>
          </div>
        )}
      </div>

      {pkg.notes && <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{pkg.notes}</div>}
      {pkg.expires_at && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 3 }}>⏳ {pkg.expires_at}</div>}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <button onClick={() => onExport(pkg)} style={btnSm}>📤 Export</button>
        {isAdmin && <>
          <button onClick={() => onEdit(pkg)} style={btnSm}>✏️ Edit</button>
          <button onClick={() => onDelete(pkg.id)} style={{ ...btnSm, background: '#450a0a', color: '#f87171', border: '1px solid #7f1d1d' }}>🗑️</button>
        </>}
      </div>
    </div>
  )
}

export function ScoreBadge({ score }) {
  const { label, color, dot } = scoreInfo(score)
  return (
    <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {dot} {score !== null ? score.toFixed(1) + '%' : '–'} {label}
    </span>
  )
}

const btnSm = { background: '#1e1b4b', color: '#94a3b8', border: '1px solid #2d2b52', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }
