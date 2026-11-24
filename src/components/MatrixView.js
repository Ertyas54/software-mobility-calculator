import React, { useState, useMemo } from 'react'
import { EQUATIONS } from '../equations'
import { K_DESCRIPTIONS, R_DESCRIPTIONS } from '../descriptions'

const K_KEYS = Array.from({ length: 12 }, (_, i) => `K${i + 1}`)
const R_KEYS = ['R1', 'R2', 'R3', 'R4']
const ALL_COLS = [...K_KEYS, ...R_KEYS]

function getName(key) {
  if (key.startsWith('K')) return K_DESCRIPTIONS[key] || key
  if (key.startsWith('R')) return R_DESCRIPTIONS[key] || key
  return key
}

export default function MatrixView() {
  const [hovered, setHovered] = useState({ row: null, col: null })

  // Строим статическую матрицу связей (парсим уравнения)
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

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Матрица графа G<sub>pss</sub></h3>
      </div>

      <div className="table-wrap" style={{ maxHeight: '400px', overflow: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="sticky-col" style={{ verticalAlign: 'bottom', minWidth: '55px' }}></th>
              {ALL_COLS.map((col) => (
                <th key={col} style={{ minWidth: '46px' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {K_KEYS.map((row) => (
              <tr key={row}>
                <td className="sticky-col row-header">{row}</td>
                {ALL_COLS.map((col) => {
                  const val = matrix[row][col]
                  let className = ''
                  if (val === 1) className = 'cell-pos'
                  if (val === -1) className = 'cell-neg'

                  return (
                    <td
                      key={col}
                      className={className}
                      onMouseEnter={() => setHovered({ row, col })}
                      onMouseLeave={() => setHovered({ row: null, col: null })}
                    >
                      {val !== 0 ? val : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
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
      <a 
            href={`${process.env.PUBLIC_URL || ''}/memo.pdf`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn"
            style={{ 
              background: '#059669', 
              color: 'white', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '12px',
              gap: '8px'
            }}
          >
            Открыть Памятку
          </a>
    </div>
  )
}