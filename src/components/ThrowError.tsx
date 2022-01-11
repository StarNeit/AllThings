import React from 'react'
interface IProps {
  readonly error: unknown
}
export default (Skeleton: React.ComponentType) => ({
  error,
  ...props
}: IProps) => {
  if (error) {
    throw error
  }
  return <Skeleton {...props} />
}
