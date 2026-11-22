import React, { useState, useMemo } from 'react'
import { EQUATIONS } from '../equations'
import { K_DESCRIPTIONS, R_DESCRIPTIONS } from '../descriptions'
import { evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

const K_KEYS = Array.from({ length: 12 }, (_, i) => `K${i + 1}`)
const R_KEYS = ['R1', 'R2', 'R3', 'R4']
const ALL_COLS = [...K_KEYS, ...R_KEYS]

function getName(key) {
  if (key.startsWith('K')) return K_DESCRIPTIONS[key] || key
  if (key.startsWith('R')) return R_DESCRIPTIONS[key] || key
  return key
}

export default function MatrixView({ values, tEnd }) {
  const [hovered, setHovered] = useState({ row: null, col: null })
  const [t, setT] = useState(0) // Локальное время для матрицы

  // 1. Строим статическую матрицу связей (парсим уравнения)
  const matrix = useMemo(() => {
    const m = {}
    K_KEYS.forEach((rowKey) => {
      m[rowKey] = {}
      ALL_COLS.forEach((colKey) => { m[rowKey][colKey] = 0 })
    })
    Object.entries(EQUATIONS).forEach(([rowKey, termsList]) => {
      termsList.forEach(({ sign, terms }) => {
        terms.forEach((term) => {
          if (term.arg) m[rowKey][term.arg] = sign
          if (term.r) m[rowKey][term.r] = sign
          if (term.rSum) term.rSum.forEach((r) => { m[rowKey][r] = sign })
        })
      })
    })
    return m
  }, [])

  // 2. Получаем текущие значения K и R на момент времени t
  const currentState = evaluateAll(t, values, tEnd)
  
  const getVal = (key) => {
    if (key.startsWith('K')) return currentState[key] ?? 0
    if (key.startsWith('R')) return values[key] ?? 0
    return 0
  }

  // Форматирование числа для заголовков
  const fmt = (v) => Number(v).toFixed(2)

  return (
    <div className="panel">
      <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <h3>Матрица графа G<sub>pss</sub></h3>
          
          {/* Ползунок времени прямо в матрице */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span>t = {fmt(t)} ч</span>
            <input 
              type="range" min={0} max={tEnd} step={0.1} value={t} 
              onChange={(e) => setT(Number(e.target.value))}
              style={{ width: '120px' }}
            />
          </div>
        </div>
        <span className="panel-hint" style={{ marginTop: '4px' }}>
          <b>1</b> — увеличение причины увеличивает следствие &nbsp;|&nbsp; 
          <b> -1</b> — увеличение причины уменьшает следствие &nbsp;|&nbsp; 
          <b>0</b> — прямой связи нет
        </span>
      </div>

      <div className="table-wrap" style={{ maxHeight: '400px', overflow: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="sticky-col">Следствие \ Причина</th>
              {ALL_COLS.map((col) => {
                const val = getVal(col)
                // Если значение больше 0.05, считаем что фактор "активен"
                const isActive = val > 0.05
                return (
                  <th key={col} style={{ minWidth: '45px', opacity: isActive ? 1 : 0.4 }}>
                    <div>{col}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>
                      {fmt(val)}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {K_KEYS.map((row) => {
              const rowVal = getVal(row)
              return (
                <tr key={row}>
                  <td className="sticky-col row-header" style={{ opacity: rowVal > 0.05 ? 1 : 0.4 }}>
                    {row} <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>({fmt(rowVal)})</span>
                  </td>
                  {ALL_COLS.map((col) => {
                    const val = matrix[row][col]
                    let className = ''
                    if (val === 1) className = 'cell-pos'
                    if (val === -1) className = 'cell-neg'
                    
                    const isHovered = hovered.row === row || hovered.col === col

                    return (
                      <td
                        key={col}
                        className={`${className} ${isHovered ? 'cell-hovered' : ''}`}
                        onMouseEnter={() => setHovered({ row, col })}
                        onMouseLeave={() => setHovered({ row: null, col: null })}
                      >
                        {val !== 0 ? val : ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Информационная панель при наведении */}
      <div className="matrix-info">
        {hovered.row && hovered.col ? (
          <span>
            <b>{hovered.col}</b> ({getName(hovered.col)}) &rarr;{' '}
            <b>{hovered.row}</b> ({getName(hovered.row)}):{' '}
            {matrix[hovered.row][hovered.col] === 1 ? (
              <span className="text-good">Усиливает (+1)</span>
            ) : matrix[hovered.row][hovered.col] === -1 ? (
              <span className="text-bad">Ослабляет (-1)</span>
            ) : (
              <span className="text-neutral">Нет прямой связи (0)</span>
            )}
          </span>
        ) : (
          <span className="text-neutral">Наведи на ячейку, чтобы увидеть расшифровку связи</span>
        )}
      </div>
    </div>
  )
}