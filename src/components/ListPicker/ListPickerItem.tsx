import React from 'react'

interface IProps {
  name?: string
  id: string
  itemKey: string
  onChange: (id: string, key: string) => void
  isChosen: boolean
}

export default class ListPickerItem extends React.Component<IProps> {
  handleClick = () => {
    this.props.onChange(this.props.id, this.props.itemKey)
  }

  render() {
    return (
      <input
        type="radio"
        id={this.props.id}
        checked={this.props.isChosen}
        onChange={this.handleClick}
        name={`choose-${this.props.name}`}
      />
    )
  }
}
