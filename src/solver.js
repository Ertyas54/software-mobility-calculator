import { EQUATIONS } from './equations'
import { evalFn } from './functions'
import { K_MAX, R_MAX } from './normalization'

function fnValue(fn, x, values) {
  const coeffs = [
    values[`f${fn}_c0`] ?? 0,
    values[`f${fn}_c1`] ?? 0,
    values[`f${fn}_c2`] ?? 0,
    values[`f${fn}_c3`] ?? 0,
  ]
  return evalFn(coeffs, x)
}

function rValue(r, values) {
  const max = R_MAX[r] ?? 1
  const raw = values[r] ?? 0
  return Math.max(0, Math.min(1, raw / max))
}

function softFactor(K, KMax, eps) {
  const epsAbs = eps * KMax
  if (epsAbs <= 0) return 1
  const nearZero = K / epsAbs
  const fZero = (nearZero * nearZero) / (1 + nearZero * nearZero)
  const nearMax = (KMax - K) / epsAbs
  const fMax = (nearMax * nearMax) / (1 + nearMax * nearMax)
  return fZero * fMax
}

function derivatives(K, values) {
  const d = {}
  Object.entries(EQUATIONS).forEach(([key, termsList]) => {
    let sum = 0
    termsList.forEach(({ sign, terms }) => {
      let product = 1
      let count = 0
      terms.forEach((term) => {
        if (term.fn != null) {
          const argValue = K[term.arg] ?? 0
          const argMax = K_MAX[term.arg] ?? 1
          const x = argMax > 0 ? argValue / argMax : 0
          const xClamped = Math.max(0, Math.min(1, x))
          const fv = fnValue(term.fn, xClamped, values)
          product *= Math.max(0, fv)
          count++
        } else if (term.r) {
          product *= rValue(term.r, values)
          count++
        }
      })
      if (count > 1) product = Math.pow(Math.max(0, product), 1 / count)
      sum += sign * product
    })
    const max = K_MAX[key] ?? 1
    const soft = softFactor(K[key] ?? 0, max, 0.05)
    d[key] = sum * (max / 100) * soft
  })
  return d
}

function rk4Step(K, values, dt) {
  const k1 = derivatives(K, values)
  const K2 = {}; Object.keys(K).forEach((key) => { K2[key] = K[key] + (dt / 2) * k1[key] })
  const k2 = derivatives(K2, values)
  const K3 = {}; Object.keys(K).forEach((key) => { K3[key] = K[key] + (dt / 2) * k2[key] })
  const k3 = derivatives(K3, values)
  const K4 = {}; Object.keys(K).forEach((key) => { K4[key] = K[key] + dt * k3[key] })
  const k4 = derivatives(K4, values)
  const result = {}
  Object.keys(K).forEach((key) => {
    const next = K[key] + (dt / 6) * (k1[key] + 2 * k2[key] + 2 * k3[key] + k4[key])
    const max = K_MAX[key] ?? 1
    result[key] = Math.max(0, Math.min(max, next))
  })
  return result
}

export function solveODE(values, tEnd, steps = 400) {
  const dt = tEnd / steps
  const initialK = {}
  for (let i = 1; i <= 12; i++) {
    const key = `K${i}`
    initialK[key] = values[key] ?? 0
  }
  const states = []
  let K = { ...initialK }
  states.push({ t: 0, K: { ...K } })
  for (let i = 1; i <= steps; i++) {
    K = rk4Step(K, values, dt)
    states.push({ t: i * dt, K: { ...K } })
  }
  return states
}

export function interpolateState(states, t) {
  const t0 = states[0].t
  const tN = states[states.length - 1].t
  if (t <= t0) return states[0].K
  if (t >= tN) return states[states.length - 1].K
  let lo = 0, hi = states.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (states[mid].t <= t) lo = mid; else hi = mid
  }
  const a = states[lo], b = states[hi]
  const ratio = (t - a.t) / (b.t - a.t || 1)
  const result = {}
  Object.keys(a.K).forEach((key) => {
    result[key] = a.K[key] + ratio * (b.K[key] - a.K[key])
  })
  return result
}
