import { R_MAX } from './normalization'
import { FN_COUNT } from './functions'
import { evaluateAll } from './polynomials'

function choice(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const K_KEYS = Array.from({ length: 12 }, (_, i) => `K${i + 1}`)

const K_TREND = {
  K1: 'up', K2: 'up', K3: 'down', K4: 'up', K5: 'up', K6: 'up',
  K7: 'up', K8: 'up', K9: 'down', K10: 'down', K11: 'down', K12: 'down',
}

function randomKValue(key) {
  const trend = K_TREND[key] ?? 'up'
  if (trend === 'down') {
    // Падающие стартуют высоко (0.55..0.75)
    return Math.round((0.55 + Math.random() * 0.20) * 100) / 100
  }
  // Растущие стартуют низко (0.05..0.25)
  return Math.round((0.05 + Math.random() * 0.20) * 100) / 100
}

export function randomK() {
  const result = {}
  K_KEYS.forEach((key) => { result[key] = randomKValue(key) })
  return result
}

function randomFnCoefficients() {
  return [
    choice([0, 0, 0.5, 1]),
    choice([1, 1.5, 2, 2.5, 3]),
    choice([0.2, 0.5, 0.8, 1, 1.5]),
    choice([0.1, 0.2, 0.5, 0.8]),
  ]
}

function randomRValue(key) {
  const max = R_MAX[key] ?? 1
  return Math.round(Math.random() * max * 100) / 100
}

export function randomFnValues(fn) {
  const [c0, c1, c2, c3] = randomFnCoefficients()
  return {
    [`f${fn}_c0`]: c0, [`f${fn}_c1`]: c1,
    [`f${fn}_c2`]: c2, [`f${fn}_c3`]: c3,
  }
}

export function randomR() {
  return {
    R1: randomRValue('R1'), R2: randomRValue('R2'),
    R3: randomRValue('R3'), R4: randomRValue('R4'),
  }
}

export function randomAllValues() {
  const result = {}
  Object.assign(result, randomK())
  Object.assign(result, randomR())
  for (let i = 1; i <= FN_COUNT; i++) Object.assign(result, randomFnValues(i))
  return result
}

export function randomOneValue(key) {
  if (key.startsWith('R')) return randomRValue(key)
  if (key.startsWith('K')) return randomKValue(key)
  const m = key.match(/^f(\d+)_c(\d+)$/)
  if (m) {
    const deg = parseInt(m[2], 10)
    if (deg === 0) return choice([0, 0, 0.5, 1])
    if (deg === 1) return choice([1, 1.5, 2, 2.5, 3])
    if (deg === 2) return choice([0.2, 0.5, 0.8, 1, 1.5])
    if (deg === 3) return choice([0.1, 0.2, 0.5, 0.8])
  }
  return 0
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const round2 = (v) => Math.round(v * 100) / 100

export function randomConditions(values, tEnd = 10) {
  const result = {}
  if (!values) {
    K_KEYS.forEach((k) => { result[k] = 0.5 })
    return result
  }

  // 1. Получаем стартовое состояние K(0) для всех лепестков
  let startState = null
  try {
    startState = evaluateAll(0, values, tEnd)
  } catch {
    K_KEYS.forEach((k) => { result[k] = values[k] ?? 0.5 })
    return result
  }

  // 2. Базовая форма = K(0)
  const base = {}
  K_KEYS.forEach((k) => {
    base[k] = Number(startState[k] ?? 0)
  })

  // 3. Сглаживаем форму по соседям (чтобы убрать острые углы "звезды")
  // Делаем 3 прохода для хорошего округления
  let smoothed = { ...base }
  for (let pass = 0; pass < 3; pass++) {
    const next = {}
    K_KEYS.forEach((k, idx) => {
      const prev = K_KEYS[(idx + K_KEYS.length - 1) % K_KEYS.length]
      const nextKey = K_KEYS[(idx + 1) % K_KEYS.length]
      // Веса: 0.4 — сам лепесток, 0.3 и 0.3 — соседи
      const blend = 0.4 * smoothed[k] + 0.3 * smoothed[prev] + 0.3 * smoothed[nextKey]
      // ЖЕСТКАЯ ГАРАНТИЯ: не опускаем ниже начального значения в этой точке
      next[k] = Math.max(blend, base[k])
    })
    smoothed = next
  }

  // 4. Финальный результат: сглаженная форма плюс небольшой отступ, 
  // чтобы линия не сливалась с графиком t=0
  const margin = 0.07
  K_KEYS.forEach((k) => {
    const cond = clamp01(smoothed[k] + margin)
    result[k] = round2(cond)
  })

  return result
}