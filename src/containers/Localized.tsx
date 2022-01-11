import React from 'react'
import { connect } from 'react-redux'

const EN_US = 'en_US'

export function getLocalized(
  messages: IProps['messages'],
  locale: IProps['locale'],
): string {
  return (
    messages[locale] ||
    messages[EN_US] ||
    Object.keys(messages)
      .map(key => messages[key])
      .pop()
  )
}

interface IProps {
  children?: (localized: any) => React.ReactElement | string
  locale: string
  messages: IMessage
}

class Localized extends React.PureComponent<IProps> {
  render() {
    const { messages, locale } = this.props
    const localized = getLocalized(messages, locale)

    if (this.props.children) {
      return React.Children.only(this.props.children(localized))
    } else {
      return <span>{localized}</span>
    }
  }
}

export default connect((state: IReduxState) => ({ locale: state.app.locale }))(
  Localized,
)
