import React from 'react'
import { css } from 'glamor'
import { between } from 'utils/math'

const menuStyle = css({
  position: 'absolute',
  right: 0,
  top: 0,
  background: '#fff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, .38)',
  minWidth: 160,
  '> *': {
    borderTop: '1px solid #ecf0f1',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  '> :hover': {
    background: '#f9f9f9',
  },
  '> :first-child': {
    borderTop: 0,
  },
})

interface IProps {
  onRequestClose: (event: MouseEvent) => void
  children: React.ReactNode
}

export default class PostOverlayMenu extends React.PureComponent<IProps> {
  menu: HTMLDivElement = null

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, true)
  }

  setMenu = (menu: HTMLDivElement) => (this.menu = menu)

  handleDocumentClick = (e: MouseEvent) => {
    if (this.menu) {
      const { bottom, left, right, top } = this.menu.getBoundingClientRect()

      if (
        !between(e.clientY, top, bottom) ||
        !between(e.clientX, left, right)
      ) {
        this.props.onRequestClose(e)
      }
    }
  }

  render() {
    return (
      <div ref={this.setMenu} {...menuStyle}>
        {this.props.children}
      </div>
    )
  }
}
