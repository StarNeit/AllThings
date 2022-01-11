import React from 'react'
import { css } from 'glamor'
import IosPaperplaneIcon from '@allthings/react-ionicons/lib/IosPaperplaneIcon'
import { View } from '@allthings/elements'
import NoOp from 'utils/noop'

const styles = {
  wrapper: css({
    background: '#fff',
    zIndex: 12,
    display: 'flex',
    borderTop: '1px solid #e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: '.5s transform',
  }),
  textarea: css({
    outline: 'none',
    border: 0,
    fontSize: 14,
    resize: 'none',
    padding: 20,
    maxHeight: '25vh',
  }),
  iconDefault: css({
    height: 40,
    width: 40,
    margin: '0 15px',
    transform: 'rotate(45deg)',
    fill: '#7e4997',
  }),
  submit: css({
    alignSelf: 'stretch',
    alignItems: 'center',
    display: 'flex',
  }),
}

interface IProps {
  autoFocus?: boolean
  autoGrow?: boolean
  disabled?: boolean
  hidden?: boolean
  icon: React.ReactNode
  onChange?: (value: string) => void
  onHeightChange?: (height: number) => void
  onSubmit: OnClick
  placeholder?: string
  value?: string
}

class StickyTextarea extends React.Component<IProps> {
  static defaultProps = {
    autoGrow: false,
    hidden: false,
    icon: <IosPaperplaneIcon {...styles.iconDefault} />,
    onSubmit: NoOp,
    placeholder: 'Write your message...',
  }

  setTextarea = (textarea: HTMLTextAreaElement) => {
    if (textarea) {
      this.adjustTextarea(textarea)
    }
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && this.props.autoGrow === false) {
      this.props.onSubmit(e)
      e.preventDefault()
      return false
    }
    return false
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { autoGrow, onChange } = this.props

    if (onChange) {
      onChange(e.target.value)
    }
    if (autoGrow) {
      this.adjustTextarea(e.target)
    }
  }

  adjustTextarea = (textarea: HTMLTextAreaElement) => {
    const { onHeightChange } = this.props

    textarea.style.height = (0 as unknown) as string
    textarea.style.height = `${textarea.scrollHeight}px`

    if (onHeightChange) {
      const actualHeight = Math.min(
        textarea.scrollHeight,
        textarea.offsetHeight,
      )
      onHeightChange(actualHeight)
    }
  }

  render() {
    const {
      icon,
      placeholder,
      onSubmit,
      onChange,
      onHeightChange,
      autoGrow,
      hidden,
      ...restProps
    } = this.props

    return (
      <View
        {...css(styles.wrapper, hidden && { transform: 'translateY(100%)' })}
        flex="none"
      >
        <textarea
          {...styles.textarea}
          cols={1}
          rows={1}
          placeholder={placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.setTextarea}
          {...restProps}
        />
        <div {...styles.submit} onClick={onSubmit}>
          {icon}
        </div>
      </View>
    )
  }
}

export default StickyTextarea
