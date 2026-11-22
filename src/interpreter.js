import { STATE_NAMES } from './polynomials'

export const UNITS = {
  K1: 'сут', K2: 'тыс. руб.', K3: '%', K4: '%', K5: '%',
  K6: '%', K7: '%', K8: 'ед.', K9: '%', K10: '% от эт.',
  K11: 'ч', K12: 'ед.',
}

const MEANING = {
  K1:  { plus: { label: 'Время переноса больше нормы', good: false }, minus: { label: 'Время переноса меньше нормы', good: true } },
  K2:  { plus: { label: 'Стоимость переноса выше нормы', good: false }, minus: { label: 'Стоимость переноса ниже нормы', good: true } },
  K3:  { plus: { label: 'Доля зависимого кода выше нормы', good: false }, minus: { label: 'Доля зависимого кода ниже нормы', good: true } },
  K4:  { plus: { label: 'Модульность выше нормы', good: true }, minus: { label: 'Модульность ниже нормы', good: false } },
  K5:  { plus: { label: 'Документированность выше нормы', good: true }, minus: { label: 'Документированность ниже нормы', good: false } },
  K6:  { plus: { label: 'Соответствие стандартам выше нормы', good: true }, minus: { label: 'Соответствие стандартам ниже нормы', good: false } },
  K7:  { plus: { label: 'Покрытие тестами выше нормы', good: true }, minus: { label: 'Покрытие тестами ниже нормы', good: false } },
  K8:  { plus: { label: 'Ошибок несовместимости больше нормы', good: false }, minus: { label: 'Ошибок несовместимости меньше нормы', good: true } },
  K9:  { plus: { label: 'Автоматизация тестирования выше нормы', good: true }, minus: { label: 'Автоматизация тестирования ниже нормы', good: false } },
  K10: { plus: { label: 'Производительность выше нормы', good: true }, minus: { label: 'Производительность ниже нормы', good: false } },
  K11: { plus: { label: 'Простой больше нормы', good: false }, minus: { label: 'Простой меньше нормы', good: true } },
  K12: { plus: { label: 'Модулей перенесено больше нормы', good: true }, minus: { label: 'Модулей перенесено меньше нормы', good: false } },
}

const SMALL = 0.05, MEDIUM = 0.25, LARGE = 0.60, NORM = 0.5

export function interpretResults(startK, endK) {
  return STATE_NAMES.map((label, i) => {
    const key = `K${i + 1}`
    return interpretOne(key, label, startK[key] ?? 0, endK[key] ?? 0)
  })
}

function interpretOne(key, label, start, end) {
  const unit = UNITS[key] ?? ''
  const meaning = MEANING[key]
  const delta = end - NORM
  const rel = Math.abs(delta) / NORM
  let changeLevel
  if (rel < SMALL) changeLevel = 'none'
  else if (rel < MEDIUM) changeLevel = 'small'
  else if (rel < LARGE) changeLevel = 'medium'
  else changeLevel = 'large'

  const changeText = `K(0) = ${formatNumber(start)} → K(t) = ${formatNumber(end)} ${unit} (норма ≈ ${formatNumber(NORM)})`

  let verdict, verdictText, verdictIcon, explanation
  if (changeLevel === 'none') {
    verdict = 'neutral'; verdictText = 'В пределах нормы'; verdictIcon = '≈'
    explanation = 'Значение близко к норме.'
  } else {
    const side = delta > 0 ? meaning.plus : meaning.minus
    verdict = side.good ? 'good' : 'bad'
    verdictText = side.good ? 'Благоприятно' : 'Неблагоприятно'
    verdictIcon = side.good ? '✓' : '✕'
    explanation = side.label + '.'
  }
  return {
    key, label: label.replace(/^K\d+ — /, ''),
    unit, start, end, delta, percent: end * 100,
    changeText, verdict, verdictText, verdictIcon, explanation,
  }
}

function formatNumber(v) {
  if (!Number.isFinite(v)) return '—'
  const abs = Math.abs(v)
  const digits = abs >= 100 ? 1 : abs >= 1 ? 2 : 3
  return v.toFixed(digits)
}
