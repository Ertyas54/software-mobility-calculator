// Правые части системы ОДУ dK_i/dt. Система (1)–(12) из PDF.
export const EQUATIONS = {
  K1: [
    { sign: +1, terms: [{ fn: 1, arg: 'K3' }, { fn: 2, arg: 'K8' }, { r: 'R3' }] },
    { sign: +1, terms: [{ fn: 1, arg: 'K3' }, { fn: 2, arg: 'K8' }, { r: 'R4' }] },
    { sign: -1, terms: [{ fn: 3, arg: 'K4' }, { fn: 4, arg: 'K5' }, { fn: 5, arg: 'K6' }, { fn: 6, arg: 'K9' }, { fn: 7, arg: 'K12' }, { r: 'R1' }] },
    { sign: -1, terms: [{ fn: 3, arg: 'K4' }, { fn: 4, arg: 'K5' }, { fn: 5, arg: 'K6' }, { fn: 6, arg: 'K9' }, { fn: 7, arg: 'K12' }, { r: 'R2' }] },
  ],
  K2: [
    { sign: +1, terms: [{ fn: 8, arg: 'K1' }, { fn: 9, arg: 'K3' }, { fn: 10, arg: 'K8' }, { fn: 11, arg: 'K11' }, { r: 'R3' }] },
    { sign: +1, terms: [{ fn: 8, arg: 'K1' }, { fn: 9, arg: 'K3' }, { fn: 10, arg: 'K8' }, { fn: 11, arg: 'K11' }, { r: 'R4' }] },
    { sign: -1, terms: [{ fn: 12, arg: 'K4' }, { r: 'R1' }] },
  ],
  K3: [
    { sign: +1, terms: [{ r: 'R3' }] },
    { sign: +1, terms: [{ r: 'R4' }] },
    { sign: -1, terms: [{ fn: 13, arg: 'K4' }, { fn: 14, arg: 'K6' }, { fn: 15, arg: 'K12' }, { r: 'R1' }] },
    { sign: -1, terms: [{ fn: 13, arg: 'K4' }, { fn: 14, arg: 'K6' }, { fn: 15, arg: 'K12' }, { r: 'R2' }] },
  ],
  K4: [
    { sign: +1, terms: [{ fn: 16, arg: 'K5' }, { fn: 17, arg: 'K12' }, { r: 'R1' }] },
    { sign: +1, terms: [{ fn: 16, arg: 'K5' }, { fn: 17, arg: 'K12' }, { r: 'R2' }] },
    { sign: -1, terms: [{ fn: 18, arg: 'K3' }, { r: 'R4' }] },
  ],
  K5: [
    { sign: +1, terms: [{ fn: 19, arg: 'K4' }, { r: 'R1' }] },
    { sign: +1, terms: [{ fn: 19, arg: 'K4' }, { r: 'R2' }] },
    { sign: -1, terms: [{ r: 'R4' }] },
  ],
  K6: [
    { sign: +1, terms: [{ fn: 20, arg: 'K12' }, { r: 'R2' }] },
    { sign: -1, terms: [{ fn: 21, arg: 'K3' }, { r: 'R4' }] },
  ],
  K7: [
    { sign: +1, terms: [{ fn: 22, arg: 'K4' }, { fn: 23, arg: 'K9' }, { fn: 24, arg: 'K12' }, { r: 'R1' }] },
  ],
  K8: [
    { sign: +1, terms: [{ fn: 25, arg: 'K3' }, { r: 'R3' }] },
    { sign: +1, terms: [{ fn: 25, arg: 'K3' }, { r: 'R4' }] },
    { sign: -1, terms: [{ fn: 26, arg: 'K4' }, { fn: 27, arg: 'K5' }, { fn: 28, arg: 'K6' }, { fn: 29, arg: 'K7' }, { fn: 30, arg: 'K9' }, { fn: 31, arg: 'K12' }, { r: 'R2' }] },
  ],
  K9: [
    { sign: +1, terms: [{ r: 'R1' }] },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: -1, terms: [{ fn: 32, arg: 'K2' }, { fn: 33, arg: 'K12' }] },
  ],
  K10: [
    { sign: +1, terms: [{ fn: 34, arg: 'K6' }, { fn: 35, arg: 'K7' }] },
    { sign: -1, terms: [{ fn: 36, arg: 'K3' }, { fn: 37, arg: 'K8' }, { r: 'R3' }] },
  ],
  K11: [
    { sign: +1, terms: [{ fn: 38, arg: 'K1' }, { fn: 39, arg: 'K8' }, { r: 'R3' }] },
    { sign: -1, terms: [{ fn: 40, arg: 'K7' }, { fn: 41, arg: 'K9' }, { fn: 42, arg: 'K12' }] },
  ],
  K12: [
    { sign: +1, terms: [{ fn: 43, arg: 'K4' }, { fn: 44, arg: 'K5' }, { fn: 45, arg: 'K7' }, { fn: 46, arg: 'K10' }, { r: 'R1' }] },
    { sign: +1, terms: [{ fn: 43, arg: 'K4' }, { fn: 44, arg: 'K5' }, { fn: 45, arg: 'K7' }, { fn: 46, arg: 'K10' }, { r: 'R2' }] },
    { sign: -1, terms: [{ fn: 47, arg: 'K1' }, { fn: 48, arg: 'K8' }, { fn: 49, arg: 'K11' }] },
  ],
}

export function getAllFnNames() {
  const set = new Set()
  Object.values(EQUATIONS).forEach((termsList) => {
    termsList.forEach(({ terms }) => {
      terms.forEach((t) => { if (t.fn != null) set.add(`f${t.fn}`) })
    })
  })
  return Array.from(set).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10))
}

export function getAllRNames() {
  const set = new Set()
  Object.values(EQUATIONS).forEach((termsList) => {
    termsList.forEach(({ terms }) => {
      terms.forEach((t) => { if (t.r) set.add(t.r) })
    })
  })
  return Array.from(set).sort()
}
