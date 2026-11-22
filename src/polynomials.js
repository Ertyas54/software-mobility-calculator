import { solveODE, interpolateState } from './solver'
import { FN_COUNT, FN_DEGREE } from './functions'

export const STATE_NAMES = [
  'K1 — Время переноса ПО',
  'K2 — Стоимость переноса',
  'K3 — Доля платформенно-зависимого кода',
  'K4 — Степень модульности архитектуры',
  'K5 — Уровень документированности',
  'K6 — Доля кода по открытым стандартам',
  'K7 — Покрытие кода тестами',
  'K8 — Ошибки несовместимости',
  'K9 — Уровень автоматизации тестирования',
  'K10 — Производительность на новой платформе',
  'K11 — Время простоя системы',
  'K12 — Модулей успешно перенесено',
]

const cache = new Map()
const CACHE_LIMIT = 30

function cacheKey(values, tMax) {
  const keys = Object.keys(values).sort()
  const parts = keys.map((k) => `${k}=${values[k]}`)
  return `${tMax}|${parts.join('&')}`
}

export function evaluateAll(t, values, tMax = 10) {
  const key = cacheKey(values, tMax)
  let states = cache.get(key)
  if (!states) {
    states = solveODE(values, tMax, 400)
    cache.set(key, states)
    if (cache.size > CACHE_LIMIT) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
  }
  return interpolateState(states, t)
}

export function getAllCoefficientNames() {
  const names = ['R1', 'R2', 'R3', 'R4']
  for (let i = 1; i <= FN_COUNT; i++) {
    for (let d = 0; d <= FN_DEGREE; d++) {
      names.push(`f${i}_c${d}`)
    }
  }
  return names
}
