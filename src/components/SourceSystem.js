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
  K1:  'dK₁/dt = f₁(K₃)·f₂(K₈)·(R₃+R₄) − (f₃(K₄)·f₄(K₅)·f₅(K₆)·f₆(K₉)·f₇(K₁₂)·(R₁+R₂))',
  K2:  'dK₂/dt = f₈(K₁)·f₉(K₃)·f₁₀(K₈)·f₁₁(K₁₁)·(R₃+R₄) − (f₁₂(K₄)·R₁)',
  K3:  'dK₃/dt = (R₃+R₄) − (f₁₃(K₄)·f₁₄(K₆)·f₁₅(K₁₂)·(R₁+R₂))',
  K4:  'dK₄/dt = f₁₆(K₅)·f₁₇(K₁₂)·(R₁+R₂) − (f₁₈(K₃)·R₄)',
  K5:  'dK₅/dt = f₁₉(K₄)·(R₁+R₂) − R₄',
  K6:  'dK₆/dt = f₂₀(K₁₂)·R₂ − (f₂₁(K₃)·R₄)',
  K7:  'dK₇/dt = f₂₂(K₄)·f₂₃(K₉)·f₂₄(K₁₂)·R₁',
  K8:  'dK₈/dt = f₂₅(K₃)·(R₃+R₄) − (f₂₆(K₄)·f₂₇(K₅)·f₂₈(K₆)·f₂₉(K₇)·f₃₀(K₉)·f₃₁(K₁₂)·R₂)',
  K9:  'dK₉/dt = (R₁+R₂) − (f₃₂(K₂)·f₃₃(K₁₂))',
  K10: 'dK₁₀/dt = f₃₄(K₆)·f₃₅(K₇) − (f₃₆(K₃)·f₃₇(K₈)·R₃)',
  K11: 'dK₁₁/dt = f₃₈(K₁)·f₃₉(K₈)·R₃ − (f₄₀(K₇)·f₄₁(K₉)·f₄₂(K₁₂))',
  K12: 'dK₁₂/dt = f₄₃(K₄)·f₄₄(K₅)·f₄₅(K₇)·f₄₆(K₁₀)·(R₁+R₂) − (f₄₇(K₁)·f₄₈(K₈)·f₄₉(K₁₁))',
}

export default function SourceSystem() {
  return (
    <div className="panel">
      <h3>Исходная система уравнений</h3>
      <div className="source-equations">
        {Object.keys(K_TITLES).map((key) => (
          <div className="source-row" key={key}>
            <span className="source-title">{K_TITLES[key]}:</span>
            <span className="source-formula">{FORMULAS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
