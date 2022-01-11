import React from 'react'
import { connect } from 'react-redux'
import CDNIntlProvider from '@allthings/cdn-intl-provider'
import { IntlConfig } from 'react-intl'

interface IProps {
  children: React.ReactElement<any>
  locale: string
  messages?: IntlConfig['messages']
  variation:
    | 'residential-informal'
    | 'commercial-informal'
    | 'commercial-formal'
}

const StoreIntlProvider: React.FC<IProps> = props => {
  const [countryCode] = props.locale.split('_')

  return (
    <CDNIntlProvider
      resourcePath="https://static.allthings.me"
      messages={props.messages}
      locale={countryCode}
      project="app"
      stage={
        ['development', 'staging'].includes(process.env.STAGE)
          ? 'staging'
          : 'production'
      }
      variation={props.variation}
    >
      {props.children}
    </CDNIntlProvider>
  )
}

export default connect(({ app }: IReduxState) => ({
  locale: app.locale,
  variation:
    app.config.segment === 'commercial'
      ? 'commercial-formal'
      : 'residential-informal',
}))(StoreIntlProvider)
