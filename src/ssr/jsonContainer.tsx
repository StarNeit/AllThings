import React from 'react'

interface IProps {
  id: string
  json: string
}

export default class JsonContainer extends React.Component<IProps> {
  render() {
    const { id, json } = this.props

    return <span style={{ display: 'none' }} id={id} data-state={json} />
  }
}
