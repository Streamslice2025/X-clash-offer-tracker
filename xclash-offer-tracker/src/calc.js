import { ITEM_MAP, SPEED_CATS } from './gameData.js'

const USD_EUR = 0.92

export function toUsd(amount, currency) {
  return currency === 'EUR' ? amount / USD_EUR : amount
}

export function speedHours(item) {
  const t = ITEM_MAP[item.typeId]
  return (t && t.speedH) ? t.speedH * item.qty : 0
}

export function fmtH(h) {
  if (h === 0) return '0h'
  if (h < 1) return `${Math.round(h * 60)}m`
  const d = Math.floor(h / 24)
  const r = +(h % 24).toFixed(1)
  if (d > 0 && r > 0) return `${d}d ${r}h`
  if (d > 0) return `${d}d`
  return `${+h.toFixed(2)}h`
}

export function fmtPer(v) {
  return v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v >= 1 ? v.toFixed(2) : v.toFixed(3)
}

export function itemLabel(item) {
  const t = ITEM_MAP[item.typeId]
  if (!t) return item.typeId
  if (t.heroSpecific && item.hero) return `${t.icon} ${item.hero} Excl. Gear Shard`
  return `${t.icon} ${t.label}`
}

export function calcRates(baselines) {
  const rates = {}
  baselines.forEach(b => {
    const usd = toUsd(b.price, b.currency || 'USD')
    b.items.forEach(({ typeId, qty }) => {
      if (!qty || qty <= 0) return
      const r = qty / usd
      if (!rates[typeId] || r < rates[typeId]) rates[typeId] = r
    })
  })
  return rates
}

export function calcScore(pkg, rates) {
  const usd = toUsd(pkg.price, pkg.currency || 'USD')
  if (!usd) return null
  let total = 0, covered = 0
  pkg.items.forEach(({ typeId, qty }) => {
    if (rates[typeId] && qty > 0) { total += qty / rates[typeId]; covered++ }
  })
  return covered ? (total / usd) * 100 : null
}

export function proPerDollar(pkg) {
  const usd = toUsd(pkg.price, pkg.currency || 'USD')
  if (!usd) return []
  const groups = {}
  pkg.items.forEach(item => {
    const t = ITEM_MAP[item.typeId]
    if (!t) return
    if (SPEED_CATS.includes(t.cat)) {
      const key = t.cat === 'Tech Speed Up' ? '🔬 Tech Speed Up' : '⏩ Speed Up'
      if (!groups[key]) groups[key] = { h: 0, isSU: true }
      groups[key].h += speedHours(item)
    } else {
      const key = t.heroSpecific && item.hero
        ? `${t.icon} ${item.hero} Excl. Gear Shard`
        : `${t.icon} ${t.label}`
      if (!groups[key]) groups[key] = { qty: 0, isSU: false }
      groups[key].qty += item.qty
    }
  })
  return Object.entries(groups).map(([label, v]) => ({
    label,
    qty: v.isSU ? v.h : v.qty,
    perDollar: v.isSU ? v.h / usd : v.qty / usd,
    isSU: v.isSU
  }))
}

export function scoreInfo(s) {
  if (s === null) return { label: 'N/A',         color: '#6b7280', dot: '⬜' }
  if (s >= 175)   return { label: 'Exceptional', color: '#10b981', dot: '🔥' }
  if (s >= 130)   return { label: 'Great',       color: '#34d399', dot: '⭐' }
  if (s >= 105)   return { label: 'Good',        color: '#60a5fa', dot: '✅' }
  if (s >= 90)    return { label: 'Fair',        color: '#fbbf24', dot: '🟡' }
  return                 { label: 'Skip',        color: '#f87171', dot: '❌' }
}

export function buildDiscordText(pkg, score, rates) {
  const { label, dot } = scoreInfo(score)
  const bd = proPerDollar(pkg)
  const totalSU  = pkg.items.reduce((a, i) => ITEM_MAP[i.typeId]?.cat === 'Speed Up'      ? a + speedHours(i) : a, 0)
  const totalTSU = pkg.items.reduce((a, i) => ITEM_MAP[i.typeId]?.cat === 'Tech Speed Up' ? a + speedHours(i) : a, 0)
  const lines = [
    `**${dot} ${pkg.name}** — ${label}${score !== null ? ` (${score.toFixed(1)}%)` : ''}`,
    ``,
    `**📦 Contents:**`,
  ]
  pkg.items.forEach(item => {
    const t = ITEM_MAP[item.typeId]
    const isSU = SPEED_CATS.includes(t?.cat)
    lines.push(isSU
      ? `• ${itemLabel(item)}: **${item.qty}×** = **${fmtH(speedHours(item))}**`
      : `• ${itemLabel(item)}: **${item.qty.toLocaleString()}**`)
  })
  if (totalSU > 0)  lines.push(`⏩ Speed Up total: **${fmtH(totalSU)}**`)
  if (totalTSU > 0) lines.push(`🔬 Tech Speed Up total: **${fmtH(totalTSU)}**`)
  lines.push(``, `💰 **${pkg.currency || 'USD'} ${Number(pkg.price).toFixed(2)}**`)
  lines.push(``, `**📊 Per $1.00:**`)
  bd.forEach(({ label: l, qty, perDollar, isSU }) => {
    lines.push(isSU
      ? `• ${l}: **${fmtH(qty)}** total · **${fmtH(perDollar)}**/\$`
      : `• ${l}: **${fmtPer(perDollar)}**/\$`)
  })
  if (score !== null) lines.push(``, `**📈 vs. Must-Buy Baseline: ${score.toFixed(1)}%**`)
  if (pkg.tag)      lines.push(``, `🏷️ ${pkg.tag}`)
  if (pkg.notes)    lines.push(`📝 ${pkg.notes}`)
  if (pkg.expires_at) lines.push(`⏳ ${pkg.expires_at}`)
  return lines.join('\n')
}

export function buildDiscordEmbed(pkg, score, rates) {
  const { label, dot } = scoreInfo(score)
  const bd = proPerDollar(pkg)
  const colorMap = { Exceptional: 0x10b981, Great: 0x34d399, Good: 0x60a5fa, Fair: 0xfbbf24, Skip: 0xf87171 }
  const fields = []
  pkg.items.forEach(item => {
    const t = ITEM_MAP[item.typeId]
    const isSU = SPEED_CATS.includes(t?.cat)
    fields.push({ name: itemLabel(item), value: isSU ? `${item.qty}× = ${fmtH(speedHours(item))}` : item.qty.toLocaleString(), inline: true })
  })
  fields.push({ name: '────────', value: '**Per $1.00**', inline: false })
  bd.forEach(({ label: l, qty, perDollar, isSU }) => {
    fields.push({ name: l, value: isSU ? `${fmtH(qty)} · ${fmtH(perDollar)}/\$` : `${fmtPer(perDollar)}/\$`, inline: true })
  })
  if (score !== null) fields.push({ name: '📈 vs. Baseline', value: `${score.toFixed(1)}%`, inline: false })
  return {
    embeds: [{
      title: `${dot} ${pkg.name}`,
      description: `**${label}** · ${pkg.currency || 'USD'} ${Number(pkg.price).toFixed(2)}${score !== null ? ` · ${score.toFixed(1)}%` : ''}`,
      color: colorMap[label] || 0x6b7280,
      fields,
      footer: { text: `X Clash Offer Tracker · ${new Date().toLocaleDateString('de-DE')}` },
      timestamp: new Date().toISOString()
    }]
  }
}

export function buildRanking(packages, rates) {
  const sorted = [...packages].sort((a, b) => (calcScore(b, rates) ?? -1) - (calcScore(a, rates) ?? -1))
  const lines = ['**🏆 X Clash Offer Tracker — Value Ranking**', '*(100% = Daily Must-Buy baseline)*', '']
  sorted.forEach((p, i) => {
    const s = calcScore(p, rates)
    const { dot, label } = scoreInfo(s)
    const bd = proPerDollar(p)
    const dm = bd.find(x => x.label.includes('Diamond'))
    const su = bd.find(x => x.isSU && !x.label.includes('Tech'))
    const extras = []
    if (dm) extras.push(`💎 ${fmtPer(dm.perDollar)}/\$`)
    if (su) extras.push(`⏩ ${fmtH(su.perDollar)}/\$`)
    lines.push(`${i + 1}. ${dot} **${p.name}** — ${s !== null ? s.toFixed(1) + '%' : 'N/A'} · ${label} · ${p.currency || 'USD'} ${Number(p.price).toFixed(2)}${extras.length ? '  |  ' + extras.join('  ') : ''}`)
  })
  return lines.join('\n')
}
