import React from 'react'

const K_TITLES = {
  K1:  'K1 — время переноса ПО',
  K2:  'K2 — стоимость переноса',
  K3:  'K3 — доля платформенно-зависимого кода',
  K4:  'K4 — модульность архитектуры',
  K5:  'K5 — документированность',
  K6:  'K6 — доля кода по открытым стандартам',
  K7:  'K7 — покрытие тестами',
  K8:  'K8 — ошибки несовместимости',
  K9:  'K9 — автоматизация тестирования',
  K10: 'K10 — производительность на новой платформе',
  K11: 'K11 — время простоя системы',
  K12: 'K12 — модулей успешно перенесено',
}

const FORMULAS = {
  K1:  'dK₁/dt = f₁⁺¹(K₃)·f₂⁺¹(K₈)·(R₃+R₄) − (f₃⁻¹(K₄)·f₄⁻¹(K₅)·f₅⁻¹(K₆)·f₆⁻¹(K₉)·f₇⁻¹(K₁₂)·(R₁+R₂))',
  K2:  'dK₂/dt = f₈⁺¹(K₁)·f₉⁺¹(K₃)·f₁₀⁺¹(K₈)·f₁₁⁺¹(K₁₁)·(R₃+R₄) − (f₁₂⁻¹(K₄)·R₁)',
  K3:  'dK₃/dt = (R₃+R₄) − (f₁₃⁻¹(K₄)·f₁₄⁻¹(K₆)·f₁₅⁻¹(K₁₂)·(R₁+R₂))',
  K4:  'dK₄/dt = f₁₆⁺¹(K₅)·f₁₇⁺¹(K₁₂)·(R₁+R₂) − (f₁₈⁻¹(K₃)·R₄)',
  K5:  'dK₅/dt = f₁₉⁺¹(K₄)·(R₁+R₂) − R₄',
  K6:  'dK₆/dt = f₂₀⁺¹(K₁₂)·R₂ − (f₂₁⁻¹(K₃)·R₄)',
  K7:  'dK₇/dt = f₂₂⁺¹(K₄)·f₂₃⁺¹(K₉)·f₂₄⁺¹(K₁₂)·R₁',
  K8:  'dK₈/dt = f₂₅⁺¹(K₃)·(R₃+R₄) − (f₂₆⁻¹(K₄)·f₂₇⁻¹(K₅)·f₂₈⁻¹(K₆)·f₂₉⁻¹(K₇)·f₃₀⁻¹(K₉)·f₃₁⁻¹(K₁₂)·R₂)',
  K9:  'dK₉/dt = (R₁+R₂) − (f₃₂⁻¹(K₂)·f₃₃⁻¹(K₁₂))',
  K10: 'dK₁₀/dt = f₃₄⁺¹(K₆)·f₃₅⁺¹(K₇) − (f₃₆⁻¹(K₃)·f₃₇⁻¹(K₈)·R₃)',
  K11: 'dK₁₁/dt = f₃₈⁺¹(K₁)·f₃₉⁺¹(K₈)·R₃ − (f₄₀⁻¹(K₇)·f₄₁⁻¹(K₉)·f₄₂⁻¹(K₁₂))',
  K12: 'dK₁₂/dt = f₄₃⁺¹(K₄)·f₄₄⁺¹(K₅)·f₄₅⁺¹(K₇)·f₄₆⁺¹(K₁₀)·(R₁+R₂) − (f₄₇⁻¹(K₁)·f₄₈⁻¹(K₈)·f₄₉⁻¹(K₁₁))',
}

function renderFormula(text) {
  const parts = text.split(/(⁺¹|⁻¹)/g)
  
  return parts.map((part, index) => {
    if (part === '⁺¹') {
      return (
        <span key={index} style={{ color: '#059669', fontWeight: 'bold' }}>
          {part}
        </span>
      )
    }
    if (part === '⁻¹') {
      return (
        <span key={index} style={{ color: '#dc2626', fontWeight: 'bold' }}>
          {part}
        </span>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

export default function SourceSystem() {
  return (
    <div className="panel">
      <h3>Исходная система уравнений</h3>
      <div className="source-equations">
        {Object.keys(K_TITLES).map((key) => (
          <div className="source-row" key={key}>
            <span className="source-title">{K_TITLES[key]}:</span>
            <span className="source-formula" style={{ lineHeight: '1.8' }}>
              {renderFormula(FORMULAS[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}