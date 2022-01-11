const compose = (...fns: ReadonlyArray<(...args: any[]) => void>) =>
  fns.reduce((f, g) => (...args) => f(g(...args)))

export default compose
