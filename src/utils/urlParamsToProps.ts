export interface IMatch {
  params: any
}
export interface IMatchParams {
  match: IMatch
}

const urlParamsToProps = (
  { match: { params } }: IMatchParams,
  map: ReadonlyArray<ReadonlyArray<string>>,
) =>
  map.reduce((obj, curr) => {
    obj[curr[1]] = params[curr[0]]
    return obj
  }, {})

export default urlParamsToProps
