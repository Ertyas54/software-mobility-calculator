// 49 функций f₁…f₄₉ — полином 3-й степени
export const FN_COUNT = 49
export const FN_DEGREE = 3

export function defaultFnCoefficients() {
  return [0, 1, 0, 0]
}

export function evalFn(coeffs, x) {
  let result = 0
  let p = 1
  for (let i = 0; i < coeffs.length; i++) {
    result += (coeffs[i] ?? 0) * p
    p *= x
  }
  return result
}

export function coefName(fn, degree) {
  return `f${fn}_c${degree}`
}
