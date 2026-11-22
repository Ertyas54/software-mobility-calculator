export const K_MAX = {
  K1: 1, K2: 1, K3: 1, K4: 1, K5: 1,
  K6: 1, K7: 1, K8: 1, K9: 1, K10: 1, K11: 1, K12: 1,
}
export const R_MAX = { R1: 1, R2: 1, R3: 1, R4: 1 }

export const K_MIN = {
  K1: 0, K2: 0, K3: 0, K4: 0, K5: 0, K6: 0,
  K7: 0, K8: 0, K9: 0, K10: 0, K11: 0, K12: 0,
}
export const R_MIN = { R1: 0, R2: 0, R3: 0, R4: 0 }

export const K_NORM = 0.5

export function getMax(name) {
  if (name.startsWith('R')) return R_MAX[name] ?? 1
  return K_MAX[name] ?? 1
}
export function getMin(name) {
  if (name.startsWith('R')) return R_MIN[name] ?? 0
  return K_MIN[name] ?? 0
}
export function normalize(name, value) {
  const max = getMax(name), min = getMin(name)
  if (max === min) return 0
  return (value - min) / (max - min)
}
export function denormalize(name, value) {
  const max = getMax(name), min = getMin(name)
  return min + value * (max - min)
}
export function normalizeAll(values) {
  const result = {}
  Object.entries(values).forEach(([name, value]) => {
    result[name] = normalize(name, value)
  })
  return result
}
export function makeDefaultConditions() {
  const result = {}
  for (let i = 1; i <= 12; i++) result[`K${i}`] = K_NORM
  return result
}
