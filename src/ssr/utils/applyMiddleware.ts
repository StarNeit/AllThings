export default <ReturnType>(
  middlewareList: ReadonlyArray<(...args: any[]) => any> = [],
  initialData: any,
  ...args: unknown[]
): ReturnType =>
  middlewareList.reduce(
    (applied, middleware) => middleware(applied, ...args),
    initialData,
  )
