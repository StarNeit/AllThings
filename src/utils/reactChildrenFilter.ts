import { Children } from 'react'

const filterChildren = (
  children: React.ReactChildren,
  filterFn: () => boolean,
) => Children.toArray(children).filter(filterFn)

export default filterChildren
