import React from 'react'
import cx from 'classnames'

interface IProps {
  className?: string
  inline?: boolean
}

export default class FormGroupItem extends React.Component<IProps> {
  static defaultProps = {
    inline: false,
  }

  render() {
    const { children } = this.props
    const classNames = cx({
      'formGroup-item': true,
      'formGroup-item-inline': this.props.inline,
    })
    return <div className={classNames}>{children}</div>
  }
}
