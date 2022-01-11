/*
 * This function accepts a list of filters whose form is { type: value || [values]}
 * and returns a query parameter.
 * E.g.: filter={ category: ['waste-management', 'region'], user : 999 }
 */

export default (filters: ReadonlyArray<IndexSignature<string | string[]>>) =>
  JSON.stringify(filters.reduce((a, b) => ({ ...a, ...b }), []))
