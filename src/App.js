import React, { useState } from 'react'
import './App.css'
import { getAllCoefficientNames } from './polynomials'
import {
  randomAllValues, randomFnValues, randomK, randomR,
  randomOneValue, randomConditions,
} from './random'
import { makeDefaultConditions } from './normalization'
import FnEditor from './components/FnEditor'
import InitialValues from './components/InitialValues'
import REditor from './components/REditor'
import SourceSystem from './components/SourceSystem'
import TimeChart from './components/TimeChart'
import RadarChart from './components/RadarChart'
import MatrixView from './components/MatrixView'

const DEFAULT_K = {
  K1: 0.60, K2: 0.65, K3: 0.70, K4: 0.25, K5: 0.30, K6: 0.30,
  K7: 0.25, K8: 0.75, K9: 0.20, K10: 0.35, K11: 0.65, K12: 0.10,
}
const DEFAULT_R = { R1: 0.30, R2: 0.30, R3: 0.20, R4: 0.60 }

const INITIAL_VALUES = (() => {
  const init = {}
  getAllCoefficientNames().forEach((name) => {
    if (name.startsWith('f')) {
      const m = name.match(/^f(\d+)_c(\d+)$/)
      if (m) {
        const deg = parseInt(m[2], 10)
        init[name] = deg === 0 ? 0 : deg === 1 ? 1 : 0.2
      }
    }
  })
  Object.assign(init, DEFAULT_K, DEFAULT_R)
  return init
})()

export default function App() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [tEnd, setTEnd] = useState(24)
  const [conditions, setConditions] = useState(makeDefaultConditions)

  const updateValue = (key, val) => setValues((p) => ({ ...p, [key]: val }))

  const randomizeAll = () => {
    const all = randomAllValues()
    const merged = { ...values, ...all }
    setValues(merged)
    setConditions(randomConditions(merged, tEnd))
  }
  const randomizeFn = (fn) => setValues((p) => ({ ...p, ...randomFnValues(fn) }))
  const randomizeOneValue = (key) => setValues((p) => ({ ...p, [key]: randomOneValue(key) }))
  const randomizeR = () => setValues((p) => ({ ...p, ...randomR() }))
  const randomizeK = () => setValues((p) => ({ ...p, ...randomK() }))
  const resetK = () => setValues((p) => ({ ...p, ...DEFAULT_K }))

  return (
    <div className="app">
      <header>
        <h1>Калькулятор модели мобильности (переносимости) программного обеспечения</h1>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={randomizeAll}>
            Сгенерировать значения
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Параметры интегрирования</h3>
            <div className="field">
              <label>Конечное время t</label>
              <input
                type="number" value={tEnd} min={1} step={1}
                onChange={(e) => setTEnd(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          <InitialValues
            values={values}
            onChange={updateValue}
            onReset={resetK}
            onRandom={randomizeK}
          />

          <REditor values={values} onChange={updateValue} onRandom={randomizeR} />

          <FnEditor
            values={values}
            onChange={updateValue}
            onRandomFn={randomizeFn}
            onRandomOne={randomizeOneValue}
          />
        </aside>

        <main className="main">
          <SourceSystem />
          
          <MatrixView values={values} tEnd={tEnd} /> 
          
          <TimeChart values={values} tEnd={tEnd} points={100} />
          <RadarChart
            values={values}
            tEnd={tEnd}
            conditions={conditions}
            onConditionsChange={setConditions}
          />
        </main>
      </div>
    </div>
  )
}
